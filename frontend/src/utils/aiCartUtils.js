const QUERY_TO_CATEGORY = {
  사과: '과일', 바나나: '과일', 딸기: '과일', 포도: '과일', 배: '과일',
  귤: '과일', 수박: '과일', 복숭아: '과일', 망고: '과일', 블루베리: '과일',
  양파: '채소', 당근: '채소', 감자: '채소', 고구마: '채소', 토마토: '채소',
  오이: '채소', 파프리카: '채소', 브로콜리: '채소', 시금치: '채소', 대파: '채소',
  계란: '단백질', 닭가슴살: '단백질', 두부: '단백질', 삼겹살: '단백질', 소고기: '단백질',
  새우: '단백질', 연어: '단백질', 참치캔: '단백질',
  우유: '유제품', 요거트: '유제품', 치즈: '유제품', 두유: '유제품',
  오렌지주스: '음료', 생수: '음료',
  쌀: '곡물/가공', 현미: '곡물/가공', 오트밀: '곡물/가공', 라면: '곡물/가공',
  파스타: '곡물/가공', 만두: '곡물/가공', 과자: '곡물/가공', 밀키트: '곡물/가공',
};

export { QUERY_TO_CATEGORY };

function groupByQuery(products) {
  const map = {};
  products.forEach(p => {
    if (!map[p.query]) map[p.query] = [];
    map[p.query].push(p);
  });
  return map;
}

function selectByBudget(items, budget) {
  const sorted = [...items].sort((a, b) => parseInt(a.price) - parseInt(b.price));
  if (budget === 'budget') return sorted[0];
  if (budget === 'premium') return sorted[Math.min(Math.floor(sorted.length * 0.75), sorted.length - 1)];
  return sorted[Math.min(Math.floor(sorted.length * 0.3), sorted.length - 1)];
}

function makeCartId() {
  return 'c_' + Math.random().toString(36).slice(2, 9);
}

function buildReason(item, query, budget, familySize, extra = '') {
  const parts = [];
  if (extra) parts.push(extra);
  if (budget === 'budget') parts.push('최저가 선택');
  else if (budget === 'premium') parts.push('프리미엄 품질');
  else parts.push('가성비 선택');
  if (item.brand) parts.push(`${item.brand} 브랜드`);
  if (familySize >= 4) parts.push('대용량 고려');
  parts.push(`${query} 필수 식재료`);
  return parts.join(' · ');
}

function buildTags(budget, extra = []) {
  const tags = [...extra];
  if (budget === 'budget') tags.push('최저가');
  else if (budget === 'premium') tags.push('프리미엄');
  else tags.push('가성비');
  return tags;
}

function toCartItem(product, query, budget, familySize, reasonExtra = '', tagExtra = []) {
  return {
    ...product,
    cartId: makeCartId(),
    quantity: 1,
    reason: buildReason(product, query, budget, familySize, reasonExtra),
    tags: buildTags(budget, tagExtra),
  };
}

export function buildAICart(products, profile) {
  const { familySize = 2, budget = 'balanced', allergies = [], diet = 'normal' } = profile;
  const byQuery = groupByQuery(products);

  const pick = (query) => {
    const items = byQuery[query];
    if (!items) return null;
    return toCartItem(selectByBudget(items, budget), query, budget, familySize);
  };

  const proteinQuery = diet === 'vegetarian' ? '두부' : '닭가슴살';
  const dairyQuery = allergies.includes('dairy') ? null : '우유';
  const eggQuery = allergies.includes('egg') ? null : '계란';

  const queries = [
    { q: '쌀', tag: '주식' },
    { q: eggQuery, tag: '단백질' },
    { q: proteinQuery, tag: '단백질' },
    { q: '양파', tag: '채소' },
    { q: '브로콜리', tag: '채소' },
    { q: '사과', tag: '과일' },
    { q: dairyQuery, tag: '유제품' },
  ];

  return queries
    .filter(({ q }) => q !== null)
    .map(({ q, tag }) => pick(q))
    .filter(Boolean);
}

const MEAL_INGREDIENTS = {
  냉면: ['대파', '오이', '계란', '참치캔'],
  된장찌개: ['두부', '대파', '감자', '양파'],
  파스타: ['파스타', '양파', '토마토', '브로콜리'],
  삼겹살: ['삼겹살', '대파', '양파', '상추'],
  볶음밥: ['계란', '대파', '당근', '참치캔'],
  샐러드: ['브로콜리', '토마토', '파프리카', '오이'],
  카레: ['감자', '당근', '양파', '소고기'],
  찌개: ['두부', '양파', '대파', '계란'],
};

export function rebuildCartForMeal(products, profile, mealKeyword) {
  const { budget = 'balanced', familySize = 2 } = profile;
  const byQuery = groupByQuery(products);

  const matched = Object.keys(MEAL_INGREDIENTS).find(m => mealKeyword.includes(m));
  if (!matched) return buildAICart(products, profile);

  return MEAL_INGREDIENTS[matched]
    .filter(q => byQuery[q])
    .map(query => {
      const item = selectByBudget(byQuery[query], budget);
      return toCartItem(item, query, budget, familySize, `${matched} 재료`, ['메뉴 맞춤']);
    });
}

export function replaceCartItem(cart, products, profile, keyword) {
  const { budget = 'balanced', familySize = 2 } = profile;
  const byQuery = groupByQuery(products);

  const target = cart.find(
    item => item.query === keyword || item.name.includes(keyword)
  );
  if (!target) return cart;

  const alternatives = (byQuery[target.query] || []).filter(p => p.name !== target.name);
  if (!alternatives.length) return cart;

  const newItem = selectByBudget(alternatives, budget);
  return cart.map(item =>
    item.cartId === target.cartId
      ? toCartItem(newItem, target.query, budget, familySize, '교체 요청', ['교체됨'])
      : item
  );
}

export function changeBudgetMode(products, profile, newBudget) {
  return buildAICart(products, { ...profile, budget: newBudget });
}

export function getMockAIResponse(message, products, profile, currentCart, onCartUpdate) {
  const msg = message;

  for (const meal of Object.keys(MEAL_INGREDIENTS)) {
    if (msg.includes(meal)) {
      const newCart = rebuildCartForMeal(products, profile, msg);
      onCartUpdate(newCart);
      return `${meal} 재료로 장바구니를 새로 구성했어요! 🍽️\n${MEAL_INGREDIENTS[meal].slice(0, 3).join(', ')} 등이 포함됩니다.`;
    }
  }

  const replaceSignals = ['바꿔', '교체', '다른 걸로', '변경'];
  if (replaceSignals.some(k => msg.includes(k))) {
    const allQueries = [...new Set(products.map(p => p.query))];
    const hit = allQueries.find(q => msg.includes(q));
    if (hit) {
      const newCart = replaceCartItem(currentCart, products, profile, hit);
      onCartUpdate(newCart);
      return `${hit}을(를) 다른 상품으로 교체했어요! ✅`;
    }
    return '어떤 상품을 교체할까요? 예) "계란 다른 걸로 바꿔줘"';
  }

  if (msg.includes('싸') || msg.includes('저렴') || msg.includes('절약') || msg.includes('알뜰')) {
    const newCart = changeBudgetMode(products, profile, 'budget');
    onCartUpdate(newCart);
    return '알뜰 모드로 재구성했어요! 최저가 상품들로 골랐습니다 💰';
  }

  if (msg.includes('신선') || msg.includes('좋은') || msg.includes('프리미엄') || msg.includes('고품질')) {
    const newCart = changeBudgetMode(products, profile, 'premium');
    onCartUpdate(newCart);
    return '신선도 우선 모드로 재구성했어요! 🌿';
  }

  if (msg.includes('채소') && (msg.includes('더') || msg.includes('추가'))) {
    const byQuery = groupByQuery(products);
    const vegQueries = ['양파', '당근', '시금치', '파프리카', '토마토'];
    const extras = vegQueries
      .filter(q => !currentCart.find(c => c.query === q) && byQuery[q])
      .slice(0, 2)
      .map(q => toCartItem(
        selectByBudget(byQuery[q], profile.budget || 'balanced'),
        q, profile.budget || 'balanced', profile.familySize || 2, '채소 추가 요청', ['추가됨']
      ));
    if (extras.length) {
      onCartUpdate([...currentCart, ...extras]);
      return `채소 ${extras.map(e => e.query).join(', ')}을 추가했어요! 🥦`;
    }
  }

  if (msg.includes('처음') || msg.includes('다시') || msg.includes('초기화')) {
    const newCart = buildAICart(products, profile);
    onCartUpdate(newCart);
    return '장바구니를 기본 구성으로 다시 만들었어요!';
  }

  return '더 구체적으로 말씀해 주시면 도와드릴게요!\n\n예시:\n• "냉면 먹을거라서 다시 짜줘"\n• "계란 다른 걸로 바꿔줘"\n• "이번엔 싸게 구성해줘"\n• "채소 더 추가해줘"';
}
