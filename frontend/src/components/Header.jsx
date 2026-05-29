export default function Header({ cartCount, userProfile, onProfileReset }) {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-icon">🛒</div>
        <span className="logo-name">장보기 AI</span>
        <span className="logo-sub">AI 맞춤 장바구니</span>
      </div>

      <div className="header-right">
        <button className="header-cart-btn">
          🛒
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>

        {userProfile && (
          <button className="header-profile-btn" onClick={onProfileReset}>
            <div className="avatar">👤</div>
            <span>
              {userProfile.familySize === 1 ? '1인' : `${userProfile.familySize}인`} ·{' '}
              {userProfile.budget === 'budget' ? '알뜰' : userProfile.budget === 'premium' ? '프리미엄' : '균형'}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
