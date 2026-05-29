import { useState } from 'react';
import CartItem from './CartItem';
import ChatAgent from './ChatAgent';
import CheckoutModal from './CheckoutModal';

function nowTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

export default function CartPanel({ cart, onCartUpdate, userProfile, allProducts }) {
  const [activeTab, setActiveTab] = useState('cart');
  const [showCheckout, setShowCheckout] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai', time: nowTime(),
      text: `안녕하세요! 오늘 맞춤 장바구니를 미리 구성해 두었어요 🛒\n\n장바구니가 자동으로 구성되었습니다. 마음에 안 드시면 편하게 말씀해 주세요!`,
    },
  ]);

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
        <div style={{ display: activeTab === 'cart' ? 'contents' : 'none' }}>
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
              <button type="button" className="checkout-btn" onClick={() => setShowCheckout(true)}>구매하기</button>
            </div>
          )}
        </div>

        {showCheckout && (
          <CheckoutModal
            cart={cart}
            total={total}
            onClose={() => setShowCheckout(false)}
          />
        )}

        <ChatAgent
          style={{ display: activeTab === 'chat' ? 'flex' : 'none' }}
          cart={cart}
          onCartUpdate={onCartUpdate}
          userProfile={userProfile}
          allProducts={allProducts}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}
