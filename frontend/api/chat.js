import OpenAI from 'openai';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const products = JSON.parse(readFileSync(join(__dirname, '../public/products.json'), 'utf8'));

const byQuery = {};
products.forEach(p => {
  if (!byQuery[p.query]) byQuery[p.query] = [];
  byQuery[p.query].push(p);
});
const ALL_QUERIES = Object.keys(byQuery);

function selectByBudget(items, budget) {
  const sorted = [...items].sort((a, b) => parseInt(a.price) - parseInt(b.price));
  if (budget === 'budget') return sorted[0];
  if (budget === 'premium') return sorted[Math.min(Math.floor(sorted.length * 0.75), sorted.length - 1)];
  return sorted[Math.min(Math.floor(sorted.length * 0.3), sorted.length - 1)];
}

function makeCartItem(query, budget, reasonPrefix = '') {
  const items = byQuery[query];
  if (!items?.length) return null;
  const item = selectByBudget(items, budget);
  const parts = [];
  if (reasonPrefix) parts.push(reasonPrefix);
  if (budget === 'budget') parts.push('최저가');
  else if (budget === 'premium') parts.push('프리미엄 품질');
  else parts.push('가성비');
  if (item.brand) parts.push(item.brand);
  parts.push(`${query} 식재료`);
  return {
    ...item,
    cartId: 'ai_' + Math.random().toString(36).slice(2, 9),
    quantity: 1,
    reason: parts.join(' · '),
    tags: [budget === 'budget' ? '최저가' : budget === 'premium' ? '프리미엄' : '가성비'],
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message, cart = [], profile = {} } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: 'message required' });

  const {
    familySize = 2, budget = 'balanced', allergies = [], diet = 'normal',
    nickname, dislikedFoods, shoppingFrequency, preferredCuisines = [],
  } = profile;

  const dietLabel = { normal: '일반식', vegetarian: '채식', diet: '다이어트', keto: '저탄고지' }[diet] || diet;
  const freqLabel = { daily: '매일', weekly2: '주 2~3회', weekly1: '주 1회', biweekly: '격주 이상' }[shoppingFrequency] || '';

  const cartSummary = cart.length
    ? cart.map(i => `• ${i.query}: ${i.name.slice(0, 25)} (₩${parseInt(i.price).toLocaleString()})`).join('\n')
    : '(비어 있음)';

  const systemPrompt = `당신은 한국 식료품 쇼핑 AI 어시스턴트입니다. 사용자의 장바구니를 관리해 줍니다.

## 사용자 프로필
- 이름: ${nickname || '사용자'}
- 가족 구성: ${familySize}인
- 예산 성향: ${budget === 'budget' ? '알뜰(최저가)' : budget === 'premium' ? '프리미엄(고품질)' : '균형(가성비)'}
- 식습관: ${dietLabel}
- 알레르기: ${allergies.length ? allergies.join(', ') : '없음'}
- 기피 식품: ${dislikedFoods || '없음'}
- 쇼핑 주기: ${freqLabel || '미설정'}
- 선호 메뉴: ${preferredCuisines.length ? preferredCuisines.join(', ') : '미설정'}

알레르기 및 기피 식품에 해당하는 재료가 포함된 상품은 절대 추천하지 마세요.

## 현재 장바구니
${cartSummary}

## 이용 가능한 상품 카테고리
${ALL_QUERIES.join(', ')}

반드시 JSON 형식으로만 응답하세요:
{
  "message": "사용자에게 보낼 친근한 한국어 메시지 (이모지 포함)",
  "action": "rebuild_cart" | "replace_item" | "add_items" | "remove_items" | "change_budget" | "chat_only",
  "queries": ["추가/교체할 카테고리명들 (위 목록에서만 선택)"],
  "remove_queries": ["제거할 카테고리명들"],
  "budget": "budget" | "balanced" | "premium",
  "reason_prefix": "AI 선택 이유 앞에 붙일 짧은 설명"
}

액션 가이드:
- rebuild_cart: 전체 재구성 (메뉴 언급, '다시 짜줘')
- replace_item: 특정 상품 교체 ('바꿔줘', '교체')
- add_items: 상품 추가 ('추가', '더 넣어줘')
- remove_items: 상품 제거 ('빼줘', '제거')
- change_budget: 예산 변경 ('싸게', '신선도 우선', '프리미엄')
- chat_only: 장바구니 변경 없음`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    });

    const ai = JSON.parse(completion.choices[0].message.content);
    const { action, queries = [], remove_queries = [], budget: newBudget, reason_prefix = '' } = ai;
    const effectiveBudget = newBudget || budget;
    let updatedCart = [...cart];

    if (action === 'rebuild_cart') {
      const targets = queries.length ? queries : ['쌀', '계란', '닭가슴살', '양파', '브로콜리', '사과', '우유'];
      updatedCart = targets.map(q => makeCartItem(q, effectiveBudget, reason_prefix)).filter(Boolean);
    } else if (action === 'replace_item' && queries.length) {
      for (const query of queries) {
        const idx = updatedCart.findIndex(i => i.query === query);
        const newItem = makeCartItem(query, effectiveBudget, reason_prefix || '교체 요청');
        if (!newItem) continue;
        if (idx >= 0) { newItem.cartId = updatedCart[idx].cartId; newItem.quantity = updatedCart[idx].quantity; updatedCart[idx] = newItem; }
        else updatedCart.push(newItem);
      }
    } else if (action === 'add_items' && queries.length) {
      const existing = new Set(updatedCart.map(i => i.query));
      for (const query of queries) {
        if (!existing.has(query)) {
          const newItem = makeCartItem(query, effectiveBudget, reason_prefix || '추가 요청');
          if (newItem) updatedCart.push(newItem);
        }
      }
    } else if (action === 'remove_items' && remove_queries.length) {
      updatedCart = updatedCart.filter(i => !remove_queries.includes(i.query));
    } else if (action === 'change_budget') {
      updatedCart = updatedCart.map(i => {
        const newItem = makeCartItem(i.query, effectiveBudget, reason_prefix || '예산 변경');
        return newItem ? { ...newItem, cartId: i.cartId, quantity: i.quantity } : i;
      });
    }

    res.json({ message: ai.message, cart: updatedCart });

  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ message: '죄송해요, 잠시 오류가 발생했어요. 다시 시도해 주세요.', cart });
  }
}
