import { useState } from 'react';

const PAYMENT_METHODS = [
  { value: 'card', label: '신용/체크카드', icon: '💳' },
  { value: 'kakaopay', label: '카카오페이', icon: '💛' },
  { value: 'naverpay', label: '네이버페이', icon: '💚' },
  { value: 'tosspay', label: '토스페이', icon: '💙' },
];

function makeOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

export default function CheckoutModal({ cart, total, onClose }) {
  const [step, setStep] = useState('confirm'); // confirm | paying | done
  const [method, setMethod] = useState('card');
  const [orderId] = useState(makeOrderId);

  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handlePay = () => {
    setStep('paying');
    setTimeout(() => setStep('done'), 1800);
  };

  if (step === 'paying') {
    return (
      <div className="modal-overlay">
        <div className="modal-card" style={{ textAlign: 'center', padding: '48px 40px' }}>
          <div className="spinner" style={{ margin: '0 auto 20px', width: 44, height: 44, border: '3px solid #e8f5ed', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <strong style={{ fontSize: 17 }}>결제 처리 중...</strong>
          <p style={{ fontSize: 14, color: 'var(--text-mid)', marginTop: 8 }}>잠시만 기다려 주세요</p>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" style={{ textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 className="modal-title">결제 완료!</h2>
          <p className="modal-subtitle">주문이 성공적으로 접수되었어요.</p>

          <div style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
            <div className="profile-row">
              <span className="profile-label">주문번호</span>
              <span className="profile-value" style={{ fontFamily: 'monospace', fontSize: 13 }}>{orderId}</span>
            </div>
            <div className="profile-row">
              <span className="profile-label">결제수단</span>
              <span className="profile-value">{PAYMENT_METHODS.find(m => m.value === method)?.label}</span>
            </div>
            <div className="profile-row" style={{ borderBottom: 'none' }}>
              <span className="profile-label">결제금액</span>
              <span className="profile-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>₩{total.toLocaleString()}</span>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 24 }}>
            영업일 기준 2~3일 내 배송 예정이에요 🚚
          </p>

          <button type="button" className="modal-next-btn" onClick={onClose} style={{ width: '100%' }}>
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>

        <div className="modal-icon">🛒</div>
        <h2 className="modal-title">주문 확인</h2>
        <p className="modal-subtitle">총 {itemCount}개 상품</p>

        <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 20 }}>
          {cart.map(item => (
            <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <span style={{ color: 'var(--text-dark)', flex: 1, marginRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.name.slice(0, 30)}
              </span>
              <span style={{ color: 'var(--text-mid)', flexShrink: 0 }}>
                {item.quantity}개 · ₩{(parseInt(item.price) * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 24, padding: '12px 0', borderTop: '2px solid var(--text-dark)' }}>
          <span>합계</span>
          <span style={{ color: 'var(--primary)' }}>₩{total.toLocaleString()}</span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 10 }}>결제 수단</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28 }}>
          {PAYMENT_METHODS.map(m => (
            <div
              key={m.value}
              className={`option-card ${method === m.value ? 'selected' : ''}`}
              style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
              onClick={() => setMethod(m.value)}
            >
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span className="opt-label" style={{ textAlign: 'left' }}>{m.label}</span>
            </div>
          ))}
        </div>

        <div className="modal-nav">
          <button type="button" className="modal-back-btn" onClick={onClose}>취소</button>
          <button type="button" className="modal-next-btn" onClick={handlePay}>
            ₩{total.toLocaleString()} 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}
