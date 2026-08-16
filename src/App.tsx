/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TelegramProvider, useTelegram } from './context/TelegramContext';
import { TopBar } from './components/TopBar';
import { BottomNav, NavTab } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { CategoriesView } from './components/CategoriesView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { OrderFlowModal } from './components/OrderFlowModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrdersView } from './components/OrdersView';
import { OrderDetailModal } from './components/OrderDetailModal';
import { SupportView } from './components/SupportView';
import { ProfileView } from './components/ProfileView';
import { BotSimulatorView } from './components/BotSimulatorView';

import {
  Product,
  StoreCategory,
  OrderItem,
  ProductPackage,
  ProductCategory
} from './types';
import { INITIAL_PRODUCTS, STORE_CATEGORIES } from './data/catalog';
import { fetchUserOrdersFromFirestore, subscribeToUserOrders } from './lib/ordersService';

function MainStoreApp() {
  const { user } = useTelegram();

  // Navigation and Modes
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [tabHistory, setTabHistory] = useState<NavTab[]>([]);
  const [isBotMode, setIsBotMode] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('gaming');
  const [selectedSubCategoryFilter, setSelectedSubCategoryFilter] = useState<string>('all');

  // State for Catalog and Orders
  const [categories, setCategories] = useState<StoreCategory[]>(STORE_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderFlowState, setOrderFlowState] = useState<{
    product: Product;
    pkg: ProductPackage;
    quantity: number;
  } | null>(null);
  const [successOrder, setSuccessOrder] = useState<OrderItem | null>(null);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState<OrderItem | null>(null);
  const [supportInitialOrderId, setSupportInitialOrderId] = useState<string>('');

  // Fetch catalog & orders from backend API
  const fetchProductsAndCategories = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);

      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.categories) setCategories(catData.categories);
      }

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.products) setProducts(prodData.products);
      }
    } catch (e) {
      console.warn('Using local fallback catalog data:', e);
    }
  };

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    try {
      // Primary: Fetch live persistent orders from Firestore
      const firestoreOrders = await fetchUserOrdersFromFirestore(user.id);
      if (firestoreOrders && firestoreOrders.length > 0) {
        setOrders(firestoreOrders);
        return;
      }

      // If user has no orders yet in Firestore, check API/fallback
      try {
        const res = await fetch(`/api/orders?telegramUserId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        }
      } catch {
        // Fallback silently
      }
    } catch (e) {
      console.warn('Error fetching orders from Firestore:', e);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchProductsAndCategories();
    fetchOrders();

    // Setup real-time listener to Firestore
    const unsubscribe = subscribeToUserOrders(user.id, (updatedOrders) => {
      setOrders(updatedOrders);

      // Keep open modals synchronized with latest order status in real time
      setSelectedDetailOrder((curr) => {
        if (!curr) return null;
        const matching = updatedOrders.find((o) => o.orderId === curr.orderId);
        return matching || curr;
      });

      setSuccessOrder((curr) => {
        if (!curr) return null;
        const matching = updatedOrders.find((o) => o.orderId === curr.orderId);
        return matching || curr;
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user.id, fetchOrders]);

  // Tab navigation helper with history tracking
  const navigateToTab = (tab: NavTab) => {
    if (tab !== activeTab) {
      setTabHistory((prev) => [...prev, activeTab]);
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Back navigation handler
  const handleGoBack = useCallback(() => {
    if (selectedDetailOrder) {
      setSelectedDetailOrder(null);
      return;
    }
    if (orderFlowState) {
      setOrderFlowState(null);
      return;
    }
    if (successOrder) {
      setSuccessOrder(null);
      return;
    }
    if (selectedProduct) {
      setSelectedProduct(null);
      return;
    }
    if (isBotMode) {
      setIsBotMode(false);
      return;
    }

    if (tabHistory.length > 0) {
      const previous = tabHistory[tabHistory.length - 1];
      setTabHistory((prev) => prev.slice(0, -1));
      setActiveTab(previous || 'home');
    } else {
      setActiveTab('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    selectedDetailOrder,
    orderFlowState,
    successOrder,
    selectedProduct,
    isBotMode,
    tabHistory
  ]);

  // Sync Telegram WebApp native BackButton
  useEffect(() => {
    const tgBackButton = window.Telegram?.WebApp?.BackButton;
    if (!tgBackButton) return;

    const canGoBack =
      activeTab !== 'home' ||
      isBotMode ||
      !!selectedProduct ||
      !!orderFlowState ||
      !!successOrder ||
      !!selectedDetailOrder;

    if (canGoBack) {
      tgBackButton.show();
      tgBackButton.onClick(handleGoBack);
    } else {
      tgBackButton.hide();
    }

    return () => {
      tgBackButton.offClick(handleGoBack);
    };
  }, [
    activeTab,
    isBotMode,
    selectedProduct,
    orderFlowState,
    successOrder,
    selectedDetailOrder,
    handleGoBack
  ]);

  // Handle category selection from home or filter
  const handleSelectCategory = (cat: ProductCategory, subCat?: string) => {
    setTabHistory((prev) => (activeTab !== 'categories' ? [...prev, activeTab] : prev));
    setSelectedCategoryFilter(cat);
    setSelectedSubCategoryFilter(subCat || 'all');
    setActiveTab('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle proceeding from product view to order modal
  const handleProceedToOrder = (
    product: Product,
    pkg: ProductPackage,
    quantity: number
  ) => {
    setSelectedProduct(null);
    setOrderFlowState({ product, pkg, quantity });
  };

  // Handle successful order creation
  const handleOrderSuccess = (newOrder: OrderItem) => {
    setOrderFlowState(null);
    setSuccessOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Handle support trigger with order ID
  const handleOpenSupportWithOrder = (orderId: string) => {
    setSelectedDetailOrder(null);
    setSuccessOrder(null);
    setSupportInitialOrderId(orderId);
    navigateToTab('support');
  };

  // Count active pending / processing orders
  const pendingOrdersCount = orders.filter(
    (o) =>
      o.orderStatus === 'Pending' ||
      o.orderStatus === 'Confirmed' ||
      o.orderStatus === 'Processing'
  ).length;

  const canGoBack =
    activeTab !== 'home' ||
    isBotMode ||
    !!selectedProduct ||
    !!orderFlowState ||
    !!successOrder ||
    !!selectedDetailOrder;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between selection:bg-[#E5092F]/30 selection:text-white">
      {/* Top Bar with Back Arrow */}
      <TopBar
        activeTab={activeTab}
        isBotMode={isBotMode}
        onToggleBotMode={() => setIsBotMode((prev) => !prev)}
        onBack={handleGoBack}
        canGoBack={canGoBack}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 pt-4">
        {isBotMode ? (
          <BotSimulatorView
            onOpenStore={() => {
              setIsBotMode(false);
              setActiveTab('home');
            }}
            onOpenOrders={() => {
              setIsBotMode(false);
              setActiveTab('orders');
            }}
            onOpenSupport={() => {
              setIsBotMode(false);
              setActiveTab('support');
            }}
            onCloseBotMode={() => setIsBotMode(false)}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                categories={categories}
                products={products}
                recentOrders={orders}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onSelectCategory={handleSelectCategory}
                onViewAllOrders={() => navigateToTab('orders')}
                onViewOrderDetails={(ord) => setSelectedDetailOrder(ord)}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesView
                categories={categories}
                products={products}
                selectedCategoryFilter={selectedCategoryFilter}
                selectedSubCategoryFilter={selectedSubCategoryFilter}
                onSelectCategoryFilter={(cat, subCat) => {
                  setSelectedCategoryFilter(cat);
                  setSelectedSubCategoryFilter(subCat || 'all');
                }}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersView
                orders={orders}
                onSelectOrder={(ord) => setSelectedDetailOrder(ord)}
                onBrowseStore={() => navigateToTab('home')}
                onRefreshOrders={fetchOrders}
                isRefreshing={isLoadingOrders}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'support' && (
              <SupportView
                initialOrderId={supportInitialOrderId}
                onBack={handleGoBack}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                orders={orders}
                onViewOrders={(filter) => {
                  if (filter) setSelectedCategoryFilter(filter);
                  navigateToTab('orders');
                }}
                onOpenSupport={() => navigateToTab('support')}
                onToggleBotMode={() => setIsBotMode(true)}
                onBack={handleGoBack}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      {!isBotMode && (
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            navigateToTab(tab);
          }}
          pendingOrdersCount={pendingOrdersCount}
        />
      )}

      {/* --- MODALS & DRAWERS --- */}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onProceedToOrder={handleProceedToOrder}
        />
      )}

      {/* Order Flow Modal */}
      {orderFlowState && (
        <OrderFlowModal
          product={orderFlowState.product}
          selectedPackage={orderFlowState.pkg}
          quantity={orderFlowState.quantity}
          onClose={() => setOrderFlowState(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Order Success Modal */}
      {successOrder && (
        <OrderSuccessModal
          order={successOrder}
          onClose={() => setSuccessOrder(null)}
          onViewOrders={() => {
            setSuccessOrder(null);
            navigateToTab('orders');
          }}
          onOpenSupport={() => handleOpenSupportWithOrder(successOrder.orderId)}
        />
      )}

      {/* Order Detail Modal */}
      {selectedDetailOrder && (
        <OrderDetailModal
          order={selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
          onOpenSupportWithOrder={handleOpenSupportWithOrder}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <TelegramProvider>
      <MainStoreApp />
    </TelegramProvider>
  );
}
