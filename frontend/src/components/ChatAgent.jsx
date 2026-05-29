import { useState, useRef, useEffect } from 'react';
import { getMockAIResponse } from '../utils/aiCartUtils';

const SUGGESTIONS = [
  '냉면 재료로 다시 짜줘',
  '계란 다른 걸로 바꿔줘',
  '이번엔 싸게 구성해줘',
  '채소 더 추가해줘',
  '신선도 우선으로 바꿔줘',
  '삼겹살 파티 준비해줘',
];

function nowTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatAgent({ cart, onCartUpdate, userProfile, allProducts }) {
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'ai', time: nowTime(),
      text: `안녕하세요! 오늘 맞춤 장바구니를 미리 구성해 두었어요 🛒\n\n${cart.length}가지 상품을 골랐습니다. 마음에 안 드시면 편하게 말씀해 주세요!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', time: nowTime(), text: trimmed }]);
    setInput('');
    setLoading(true);

    let responseMessage;
    let newCart = cart;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, cart, profile: userProfile }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      responseMessage = data.message;
      newCart = data.cart;

    } catch {
      // fallback to mock when API not available (local dev without backend)
      responseMessage = getMockAIResponse(trimmed, allProducts, userProfile, cart, c => { newCart = c; });
    }

    onCartUpdate(newCart);
    setMessages(prev => [
      ...prev,
      { id: Date.now() + 1, role: 'ai', time: nowTime(), text: responseMessage },
    ]);
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="chat-agent">
      <div className="chat-messages" ref={messagesRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`chat-msg ${msg.role}`}>
            <div className="chat-msg-row">
              {msg.role === 'ai' && <div className="chat-msg-avatar">🤖</div>}
              <div className="chat-bubble">{msg.text}</div>
            </div>
            <span className="chat-msg-time">{msg.time}</span>
          </div>
        ))}

        {loading && (
          <div className="chat-msg ai">
            <div className="chat-msg-row">
              <div className="chat-msg-avatar">🤖</div>
              <div className="chat-typing">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-suggestions">
        {SUGGESTIONS.map(s => (
          <button key={s} className="suggestion-chip" onClick={() => send(s)} disabled={loading}>
            {s}
          </button>
        ))}
      </div>

      <div className="chat-input-area">
        <textarea
          className="chat-input"
          placeholder="장바구니 수정 요청... (Enter 전송)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="chat-send-btn" onClick={() => send(input)} disabled={!input.trim() || loading}>
          ↑
        </button>
      </div>
    </div>
  );
}
