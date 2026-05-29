import { useState, useEffect } from 'react';
import Header from './components/Header';
import OnboardingModal from './components/OnboardingModal';
import ProductGrid from './components/ProductGrid';
import CartPanel from './components/CartPanel';
import { buildAICart } from './utils/aiCartUtils';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [cart, setCart] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [buildingCart, setBuildingCart] = useState(false);

  useEffect(() => {
    fetch('/products.json')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        setLoadingProducts(false);

        const saved = localStorage.getItem('groceryAI_profile');
        if (saved) {
          try {
            const profile = JSON.parse(saved);
            setUserProfile(profile);
            setCart(buildAICart(data, profile));
          } catch {
            setShowOnboarding(true);
          }
        } else {
          setShowOnboarding(true);
        }
      })
      .catch(() => setLoadingProducts(false));
  }, []);

  const handleOnboardingComplete = async (profile) => {
    localStorage.setItem('groceryAI_profile', JSON.stringify(profile));
    setUserProfile(profile);
    setShowOnboarding(false);
    setBuildingCart(true);
    await new Promise(r => setTimeout(r, 1600));
    setCart(buildAICart(products, profile));
    setBuildingCart(false);
  };

  const handleProfileReset = () => {
    localStorage.removeItem('groceryAI_profile');
    setUserProfile(null);
    setCart([]);
    setShowOnboarding(true);
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  if (loadingProducts) {
    return (
      <div className="building-overlay">
        <div className="building-card">
          <div className="spinner" />
          <strong>상품 데이터 불러오는 중...</strong>
          <p>잠시만 기다려 주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Header
        cartCount={totalItems}
        userProfile={userProfile}
        onProfileReset={handleProfileReset}
      />

      {showOnboarding && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      {buildingCart && (
        <div className="building-overlay">
          <div className="building-card">
            <div className="spinner" />
            <strong>AI가 맞춤 장바구니를 구성하고 있어요...</strong>
            <p>구매 성향에 맞는 상품을 고르고 있습니다</p>
          </div>
        </div>
      )}

      {!showOnboarding && (
        <main className="main-layout">
          <section className="product-section">
            <ProductGrid
              products={products}
              cart={cart}
              onCartUpdate={setCart}
              userProfile={userProfile}
            />
          </section>

          <aside className="cart-section">
            <CartPanel
              cart={cart}
              onCartUpdate={setCart}
              userProfile={userProfile}
              allProducts={products}
            />
          </aside>
        </main>
      )}
    </div>
  );
}
