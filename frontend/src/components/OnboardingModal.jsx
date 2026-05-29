import { useState } from 'react';

const STEPS = 3;

const FAMILY_OPTIONS = [
  { value: 1, icon: '🧑', label: '1인', desc: '혼자 생활' },
  { value: 2, icon: '👫', label: '2인', desc: '2인 가구' },
  { value: 4, icon: '👨‍👩‍👧‍👦', label: '3~4인', desc: '소가족' },
  { value: 5, icon: '🏠', label: '5인 이상', desc: '대가족' },
];

const BUDGET_OPTIONS = [
  { value: 'budget', icon: '💰', label: '알뜰하게', desc: '최저가 중심' },
  { value: 'balanced', icon: '⚖️', label: '균형있게', desc: '가성비 추천' },
  { value: 'premium', icon: '✨', label: '프리미엄', desc: '품질 우선' },
];

const ALLERGY_OPTIONS = [
  { value: 'egg', icon: '🥚', label: '달걀 알레르기' },
  { value: 'dairy', icon: '🥛', label: '유제품 알레르기' },
  { value: 'seafood', icon: '🦐', label: '해산물 알레르기' },
  { value: 'nuts', icon: '🥜', label: '견과류 알레르기' },
];

const DIET_OPTIONS = [
  { value: 'normal', icon: '🍽️', label: '일반식', desc: '제한 없음' },
  { value: 'vegetarian', icon: '🥗', label: '채식', desc: '육류 제외' },
  { value: 'diet', icon: '🏃', label: '다이어트', desc: '저칼로리' },
  { value: 'keto', icon: '🥩', label: '저탄고지', desc: '탄수화물 제한' },
];

export default function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    familySize: null,
    budget: null,
    allergies: [],
    diet: null,
  });

  const canNext = [
    profile.familySize !== null,
    profile.budget !== null,
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
      });
    }
  };

  const toggleAllergy = (val) => {
    setProfile(p => ({
      ...p,
      allergies: p.allergies.includes(val)
        ? p.allergies.filter(a => a !== val)
        : [...p.allergies, val],
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

        {step === 0 && (
          <>
            <div className="modal-icon">👋</div>
            <h2 className="modal-title">안녕하세요!</h2>
            <p className="modal-subtitle">
              AI가 맞춤 장바구니를 만들어 드릴게요.<br />
              먼저 가족 구성을 알려주세요.
            </p>
            <div className="option-grid">
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

        {step === 1 && (
          <>
            <div className="modal-icon">💡</div>
            <h2 className="modal-title">예산 성향</h2>
            <p className="modal-subtitle">상품 선택 기준을 알려주세요.</p>
            <div className="option-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
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

            <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 8 }}>식습관 (선택)</p>
            <div className="option-grid">
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

        {step === 2 && (
          <>
            <div className="modal-icon">🍽️</div>
            <h2 className="modal-title">알레르기 · 기피 식품</h2>
            <p className="modal-subtitle">해당하는 항목을 선택해 주세요. (없으면 건너뛰기)</p>
            <div className="checkbox-grid">
              {ALLERGY_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`check-item ${profile.allergies.includes(opt.value) ? 'checked' : ''}`}
                  onClick={() => toggleAllergy(opt.value)}
                >
                  <div className="check-box">
                    {profile.allergies.includes(opt.value) ? '✓' : ''}
                  </div>
                  <span>{opt.icon} {opt.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="modal-nav">
          {step > 0 && (
            <button className="modal-back-btn" onClick={() => setStep(s => s - 1)}>
              ← 이전
            </button>
          )}
          <button className="modal-next-btn" onClick={handleNext} disabled={!canNext}>
            {step < STEPS - 1 ? '다음 →' : '🤖 AI 장바구니 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
}
