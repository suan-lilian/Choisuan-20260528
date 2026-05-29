const DIET_LABELS = { normal: '일반식', vegetarian: '채식', diet: '다이어트', keto: '저탄고지' };
const BUDGET_LABELS = { budget: '알뜰하게 💰', balanced: '균형있게 ⚖️', premium: '프리미엄 ✨' };
const FREQUENCY_LABELS = { daily: '매일 📅', weekly2: '주 2~3회 🗓️', weekly1: '주 1회 📆', biweekly: '격주 이상 🗃️' };
const ALLERGY_LABELS = { egg: '달걀 🥚', dairy: '유제품 🥛', seafood: '해산물 🦐', nuts: '견과류 🥜', gluten: '글루텐 🌾', pork: '돼지고기 🐷' };
const FAMILY_LABELS = { 1: '1인 🧑', 2: '2인 👫', 4: '3~4인 👨‍👩‍👧', 5: '5인 이상 🏠' };
const DIET_ICONS = { normal: '🍽️', vegetarian: '🥗', diet: '🏃', keto: '🥩' };

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="profile-row">
      <span className="profile-label">{label}</span>
      <span className="profile-value">{value}</span>
    </div>
  );
}

export default function ProfileModal({ profile, onClose, onEdit }) {
  const dietIcon = DIET_ICONS[profile.diet] || '🍽️';
  const dietLabel = DIET_LABELS[profile.diet] || '일반식';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card profile-modal-card" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-icon">👤</div>
        <h2 className="modal-title">{profile.nickname || '내 프로필'}</h2>
        <p className="modal-subtitle">저장된 맞춤 정보예요</p>

        <div className="profile-rows">
          <Row label="가족 구성" value={FAMILY_LABELS[profile.familySize] || `${profile.familySize}인`} />
          <Row label="예산 성향" value={BUDGET_LABELS[profile.budget] || '균형있게'} />
          <Row label="식습관" value={`${dietIcon} ${dietLabel}`} />
          <Row label="쇼핑 주기" value={FREQUENCY_LABELS[profile.shoppingFrequency]} />
          <Row
            label="알레르기"
            value={profile.allergies?.length ? profile.allergies.map(a => ALLERGY_LABELS[a] || a).join('  ') : null}
          />
          <Row label="기피 식품" value={profile.dislikedFoods || null} />
          <Row
            label="선호 메뉴"
            value={profile.preferredCuisines?.length ? profile.preferredCuisines.join(' · ') : null}
          />
        </div>

        <div className="modal-nav" style={{ marginTop: 28 }}>
          <button type="button" className="modal-back-btn" onClick={onEdit}>
            ✏️ 정보 수정
          </button>
          <button type="button" className="modal-next-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
