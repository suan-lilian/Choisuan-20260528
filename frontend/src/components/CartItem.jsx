import { useState } from 'react';

const QUERY_EMOJI = {
  사과: '🍎', 바나나: '🍌', 딸기: '🍓', 포도: '🍇', 배: '🍐', 귤: '🍊',
  수박: '🍉', 복숭아: '🍑', 망고: '🥭', 블루베리: '🫐',
  양파: '🧅', 당근: '🥕', 감자: '🥔', 고구마: '🍠', 토마토: '🍅',
  오이: '🥒', 파프리카: '🫑', 브로콜리: '🥦', 시금치: '🥬', 대파: '🌿',
  계란: '🥚', 닭가슴살: '🍗', 두부: '🟫', 삼겹살: '🥩', 소고기: '🥩',
  새우: '🍤', 연어: '🐟', 참치캔: '🐟',
  우유: '🥛', 요거트: '🫙', 치즈: '🧀', 두유: '🥛',
  오렌지주스: '🍊', 생수: '💧',
  쌀: '🍚', 현미: '🌾', 오트밀: '🌾', 라면: '🍜', 파스타: '🍝',
  만두: '🥟', 과자: '🍪', 밀키트: '🍱',
};

export default function CartItem({ item, onQuantityChange, onRemove }) {
  const [imgError, setImgError] = useState(false);
  const emoji = QUERY_EMOJI[item.query] || '🛒';
  const price = parseInt(item.price).toLocaleString();

  return (
    <div className="cart-item">
      {imgError || !item.image ? (
        <div className="cart-item-img-fallback">{emoji}</div>
      ) : (
        <img
          className="cart-item-img"
          src={item.image}
          alt={item.name}
          onError={() => setImgError(true)}
        />
      )}

      <div className="cart-item-right">
        <div className="cart-item-name">{item.name}</div>
        <div className="cart-item-price">₩{price}</div>

        {item.reason && (
          <div className="ai-reason">
            <span className="ai-reason-icon">🤖</span>
            <span className="ai-reason-text">{item.reason}</span>
          </div>
        )}

        <div className="cart-item-controls">
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => onQuantityChange(item.cartId, item.quantity - 1)}
            >
              −
            </button>
            <span className="qty-num">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => onQuantityChange(item.cartId, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button className="remove-btn" onClick={() => onRemove(item.cartId)}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
