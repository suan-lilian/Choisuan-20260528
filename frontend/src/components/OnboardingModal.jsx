import { useState } from 'react';

const STEPS = 4;

const FAMILY_OPTIONS = [
  { value: 1, icon: '🧑', label: '1인', desc: '혼자 생활' },
  { value: 2, icon: '👫', label: '2인', desc: '2인 가구' },
  { value: 4, icon: '👨‍👩‍👧', label: '3~4인', desc: '소가족' },
  { value: 5, icon: '🏠', label: '5인 이상', desc: '대가족' },
];

const BUDGET_OPTIONS = [
  { value: 'budget', icon: '💰', label: '알뜰하게', desc: '최저가 중심' },
  { value: 'balanced', icon: '⚖️', label: '균형있게', desc: '가성비 추천' },
  { value: 'premium', icon: '✨', label: '프리미엄', desc: '품질 우선' },
];

const DIET_OPTIONS = [
  { value: 'normal', icon: '🍽️', label: '일반식', desc: '제한 없음' },
  { value: 'vegetarian', icon: '🥗', label: '채식', desc: '육류 제외' },
  { value: 'diet', icon: '🏃', label: '다이어트', desc: '저칼로리' },
  { value: 'keto', icon: '🥩', label: '저탄고지', desc: '탄수화물 제한' },
];

const ALLERGY_OPTIONS = [
  { value: 'egg', icon: '🥚', label: '달걀' },
  { value: 'dairy', icon: '🥛', label: '유제품' },
  { value: 'seafood', icon: '🦐', label: '해산물' },
  { value: 'nuts', icon: '🥜', label: '견과류' },
  { value: 'gluten', icon: '🌾', label: '글루텐' },
  { value: 'pork', icon: '🐷', label: '돼지고기' },
];

const FREQUENCY_OPTIONS = [
  { value: 'daily', icon: '📅', label: '매일', desc: '신선식품 위주' },
  { value: 'weekly2', icon: '🗓️', label: '주 2~3회', desc: '일반적인 주기' },
  { value: 'weekly1', icon: '📆', label: '주 1회', desc: '주말 한 번에' },
  { value: 'biweekly', icon: '🗃️', label: '격주 이상', desc: '대량 구매' },
];

const CUISINE_OPTIONS = [
  { value: '한식', icon: '🍚' },
  { value: '양식', icon: '🍝' },
  { value: '일식', icon: '🍱' },
  { value: '중식', icon: '🥡' },
  { value: '간편식', icon: '🥪' },
  { value: '베이킹', icon: '🧁' },
];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    nickname: '',
    familySize: null,
    budget: null,
    diet: null,
    allergies: [],
    dislikedFoods: '',
    shoppingFrequency: null,
    preferredCuisines: [],
  });

  const canNext = [
    profile.familySize !== null,
    profile.budget !== null,
    true,
    true,
  ][step];

  const handleNext = () => {
    if (step < STEPS - 1) {
      setStep(s => s + 1);
    } else {
      onComplete({
        ...profile,
        familySize: profile.familySize ?? 2,
        budget: profile.budget ?? 'balanced',
        diet: profile.diet ?? 'normal',
        shoppingFrequency: profile.shoppingFrequency ?? 'weekly1',
      });
    }
  };

  const toggle = (field, value) => {
    setProfile(p => ({
      ...p,
      [field]: p[field].includes(value)
        ? p[field].filter(v => v !== value)
        : [...p[field], value],
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-progress">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={`progress-dot ${i <= step ? 'done' : ''}`} />
          ))}
        </div>

        {/* Step 0: 기본 정보 */}
        {step === 0 && (
          <>
            <div className="modal-icon">👋</div>
            <h2 className="modal-title">안녕하세요!</h2>
            <p className="modal-subtitle">AI 맞춤 장바구니를 위해 기본 정보를 알려주세요.</p>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-mid)', display: 'block', marginBottom: 8 }}>
                닉네임 (선택)
              </label>
              <input
                type="text"
                placeholder="예: 수안이네"
                value={profile.nickname}
                onChange={e => setProfile(p => ({ ...p, nickname: e.target.value }))}
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)',
                  fontSize: 14, outline: 'none',
                }}
                maxLength={20}
              />
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>가족 구성</p>
            <div className="option-grid" style={{ marginBottom: 0 }}>
              {FAMILY_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`option-card ${profile.familySize === opt.value ? 'selected' : ''}`}
                  onClick={() => setProfile(p => ({ ...p, familySize: opt.value }))}
                >
                  <div className="opt-icon">{opt.icon}</div>
                  <div className="opt-label">{opt.label}</div>
                  <div className="opt-desc">{opt.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 1: 예산 & 식습관 */}
        {step === 1 && (
          <>
            <div className="modal-icon">💡</div>
            <h2 className="modal-title">예산 & 식습관</h2>
            <p className="modal-subtitle">상품 선택 기준을 알려주세요.</p>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>예산 성향</p>
            <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 20 }}>
              {BUDGET_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`option-card ${profile.budget === opt.value ? 'selected' : ''}`}
                  onClick={() => setProfile(p => ({ ...p, budget: opt.value }))}
                >
                  <div className="opt-icon">{opt.icon}</div>
                  <div className="opt-label">{opt.label}</div>
                  <div className="opt-desc">{opt.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>식습관</p>
            <div className="option-grid" style={{ marginBottom: 0 }}>
              {DIET_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`option-card ${profile.diet === opt.value ? 'selected' : ''}`}
                  onClick={() => setProfile(p => ({ ...p, diet: opt.value }))}
                >
                  <div className="opt-icon">{opt.icon}</div>
                  <div className="opt-label">{opt.label}</div>
                  <div className="opt-desc">{opt.desc}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: 알레르기 & 기피 식품 */}
        {step === 2 && (
          <>
            <div className="modal-icon">🚫</div>
            <h2 className="modal-title">알레르기 & 기피 식품</h2>
            <p className="modal-subtitle">해당 항목을 선택해 주세요. (없으면 건너뛰기)</p>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>알레르기</p>
            <div className="checkbox-grid" style={{ marginBottom: 20 }}>
              {ALLERGY_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`check-item ${profile.allergies.includes(opt.value) ? 'checked' : ''}`}
                  onClick={() => toggle('allergies', opt.value)}
                >
                  <div className="check-box">
                    {profile.allergies.includes(opt.value) ? '✓' : ''}
                  </div>
                  <span>{opt.icon} {opt.label}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 8 }}>기피 식품 (직접 입력)</p>
            <textarea
              placeholder="예: 고수, 가지, 피망 등 싫어하는 식재료를 입력해 주세요"
              value={profile.dislikedFoods}
              onChange={e => setProfile(p => ({ ...p, dislikedFoods: e.target.value }))}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)',
                fontSize: 13, outline: 'none', resize: 'none', height: 72,
                marginBottom: 28, fontFamily: 'inherit', lineHeight: 1.5,
              }}
            />
          </>
        )}

        {/* Step 3: 쇼핑 패턴 & 선호 메뉴 */}
        {step === 3 && (
          <>
            <div className="modal-icon">🛒</div>
            <h2 className="modal-title">쇼핑 패턴</h2>
            <p className="modal-subtitle">마지막 단계예요!</p>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>쇼핑 주기</p>
            <div className="option-grid" style={{ marginBottom: 20 }}>
              {FREQUENCY_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`option-card ${profile.shoppingFrequency === opt.value ? 'selected' : ''}`}
                  onClick={() => setProfile(p => ({ ...p, shoppingFrequency: opt.value }))}
                >
                  <div className="opt-icon">{opt.icon}</div>
                  <div className="opt-label">{opt.label}</div>
                  <div className="opt-desc">{opt.desc}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>
              자주 만드는 메뉴 <span style={{ color: 'var(--text-light)' }}>(복수 선택)</span>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {CUISINE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle('preferredCuisines', opt.value)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 20,
                    border: `1.5px solid ${profile.preferredCuisines.includes(opt.value) ? 'var(--primary)' : 'var(--border)'}`,
                    background: profile.preferredCuisines.includes(opt.value) ? 'var(--primary-bg)' : 'var(--surface)',
                    color: profile.preferredCuisines.includes(opt.value) ? 'var(--primary)' : 'var(--text-mid)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  {opt.icon} {opt.value}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="modal-nav">
          {step > 0 && (
            <button type="button" className="modal-back-btn" onClick={() => setStep(s => s - 1)}>
              ← 이전
            </button>
          )}
          <button type="button" className="modal-next-btn" onClick={handleNext} disabled={!canNext}>
            {step < STEPS - 1 ? '다음 →' : '🤖 AI 장바구니 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
}
