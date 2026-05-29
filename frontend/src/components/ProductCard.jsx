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

export default function ProductCard({ product, inCart, onAdd }) {
  const [imgError, setImgError] = useState(false);

  const price = parseInt(product.price).toLocaleString();
  const emoji = QUERY_EMOJI[product.query] || '🛒';

  return (
    <div className="product-card">
      {imgError || !product.image ? (
        <div className="product-card-img-fallback">{emoji}</div>
      ) : (
        <img
          className="product-card-img"
          src={product.image}
          alt={product.name}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      )}
      <div className="product-card-body">
        {product.brand && (
          <div className="product-card-brand">{product.brand}</div>
        )}
        <div className="product-card-name">{product.name}</div>
        <div className="product-card-price">₩{price}</div>
        <button
          className={`product-card-add-btn ${inCart ? 'in-cart' : ''}`}
          onClick={() => onAdd(product)}
        >
          {inCart ? '✓ 담겨있음' : '+ 담기'}
        </button>
      </div>
    </div>
  );
}
