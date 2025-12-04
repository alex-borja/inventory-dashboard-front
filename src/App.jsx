import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ApiProvider } from './context/ApiContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProductsView from './components/products/ProductsView';
import CategoriesView from './components/categories/CategoriesView';
import AlertsView from './components/alerts/AlertsView';
import './styles/index.css';

function App() {
  const [activeSection, setActiveSection] = useState('products');

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        switch (e.key) {
          case '1':
            setActiveSection('products');
            break;
          case '2':
            setActiveSection('categories');
            break;
          case '3':
            setActiveSection('alerts');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ApiProvider>
      <div className="app-layout">
        <Header activeSection={activeSection} onNavigate={setActiveSection} />
        
        <main className="main-content">
          {activeSection === 'products' && <ProductsView />}
          {activeSection === 'categories' && <CategoriesView />}
          {activeSection === 'alerts' && <AlertsView />}
        </main>
        
        <Footer />
        <Toaster position="bottom-right" />
      </div>
    </ApiProvider>
  );
}

export default App;
