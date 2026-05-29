import { useState } from 'react';
import CartItem from './CartItem';
import ChatAgent from './ChatAgent';

export default function CartPanel({ cart, onCartUpdate, userProfile, allProducts }) {
  const [activeTab, setActiveTab] = useState('cart');

  const total = cart.reduce((sum, item) => sum + parseInt(item.price) * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (cartId, newQty) => {
    if (newQty < 1) {
      onCartUpdate(cart.filter(item => item.cartId !== cartId));
    } else {
      onCartUpdate(cart.map(item =>
        item.cartId === cartId ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const handleRemove = (cartId) => {
    onCartUpdate(cart.filter(item => item.cartId !== cartId));
  };

  return (
    <div className="cart-panel">
      <div className="cart-tabs">
        <button
          type="button"
          className={`cart-tab ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          🛒 AI 장바구니 {itemCount > 0 && `(${itemCount})`}
        </button>
        <button
          type="button"
          className={`cart-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 채팅으로 수정
        </button>
      </div>

      <div className="cart-body">
        {activeTab === 'cart' ? (
          <>
            <div className="cart-header">
              <span className="ai-badge">🤖 AI 추천</span>
              <span className="cart-header-title">맞춤 장바구니</span>
              <span className="cart-header-count">상품 {cart.length}종</span>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🛒</div>
                <p>장바구니가 비어 있어요.<br />상품을 추가하거나 채팅으로<br />AI에게 구성을 요청해 보세요!</p>
              </div>
            ) : (
              <div className="cart-list">
                {cart.map(item => (
                  <CartItem
                    key={item.cartId}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total-row">
                  <span className="cart-total-label">합계 ({itemCount}개)</span>
                  <span className="cart-total-price">₩{total.toLocaleString()}</span>
                </div>
                <button type="button" className="checkout-btn">구매하기</button>
              </div>
            )}
          </>
        ) : (
          <ChatAgent
            cart={cart}
            onCartUpdate={onCartUpdate}
            userProfile={userProfile}
            allProducts={allProducts}
          />
        )}
      </div>
    </div>
  );
}
