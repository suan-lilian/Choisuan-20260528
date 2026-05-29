export default function Header({ cartCount, userProfile, onProfileClick }) {
  const nickname = userProfile?.nickname;
  const budgetLabel =
    userProfile?.budget === 'budget' ? '알뜰' :
    userProfile?.budget === 'premium' ? '프리미엄' : '균형';
  const familyLabel =
    userProfile?.familySize === 1 ? '1인' :
    userProfile?.familySize === 5 ? '5인+' :
    userProfile?.familySize === 4 ? '3~4인' :
    `${userProfile?.familySize || 2}인`;

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
          <button className="header-profile-btn" onClick={onProfileClick}>
            <div className="avatar">👤</div>
            <span>
              {nickname ? nickname : `${familyLabel} · ${budgetLabel}`}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
