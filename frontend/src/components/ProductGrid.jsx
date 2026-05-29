import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { QUERY_TO_CATEGORY } from '../utils/aiCartUtils';

const CATEGORIES = ['전체', '과일', '채소', '단백질', '유제품', '음료', '곡물/가공'];

export default function ProductGrid({ products, cart, onCartUpdate, userProfile }) {
  const [activeCategory, setActiveCategory] = useState('전체');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== '전체') {
      list = list.filter(p => QUERY_TO_CATEGORY[p.query] === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        p => p.name.toLowerCase().includes(q) || p.query.includes(q)
      );
    }
    return list;
  }, [products, activeCategory, search]);

  const cartProductNames = new Set(cart.map(c => c.name));

  const handleAdd = (product) => {
    if (cartProductNames.has(product.name)) return;
    const newItem = {
      ...product,
      cartId: 'manual_' + Math.random().toString(36).slice(2, 9),
      quantity: 1,
      reason: '직접 선택한 상품',
      tags: ['직접 선택'],
    };
    onCartUpdate([...cart, newItem]);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
        <div className="header-search" style={{ maxWidth: '100%', flex: 1 }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="상품 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid-header">
        <span className="product-count">상품 {filtered.length}개</span>
      </div>

      <div className="product-grid">
        {filtered.map((product, i) => (
          <ProductCard
            key={`${product.name}-${i}`}
            product={product}
            inCart={cartProductNames.has(product.name)}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </div>
  );
}
