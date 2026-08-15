import React, { createContext, useContext, useState, useEffect } from 'react';
import { TelegramUser } from '../types';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: {
          user?: TelegramUser;
          query_id?: string;
          auth_date?: string;
          hash?: string;
        };
        version?: string;
        platform?: string;
        colorScheme?: 'light' | 'dark';
        themeParams?: Record<string, any>;
        isExpanded?: boolean;
        viewportHeight?: number;
        viewportStableHeight?: number;
        headerColor?: string;
        backgroundColor?: string;
        BackButton?: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

interface TelegramContextType {
  user: TelegramUser;
  isInsideTelegram: boolean;
  haptic: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
  openTelegramLink: (url: string) => void;
  setUser: (user: TelegramUser) => void;
  switchDemoUser: (index: number) => void;
}

const DEMO_USERS: TelegramUser[] = [
  {
    id: 582910482,
    username: 'Raf_babi',
    first_name: 'Raf',
    last_name: 'Babi',
    is_premium: true,
    photo_url: '/babistorelogo.jpg'
  },
  {
    id: 918237461,
    username: 'sarah_stars',
    first_name: 'Sarah',
    last_name: 'Chen',
    is_premium: false,
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 382910475,
    username: 'david_crypto',
    first_name: 'David',
    last_name: 'Miller',
    is_premium: true,
    photo_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
  }
];

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TelegramUser>(DEMO_USERS[0]);
  const [isInsideTelegram, setIsInsideTelegram] = useState(false);

  useEffect(() => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        try {
          tg.setHeaderColor('#090a0f');
          tg.setBackgroundColor('#090a0f');
        } catch (_) {}

        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user);
          setIsInsideTelegram(true);
        } else if (tg.initData) {
          setIsInsideTelegram(true);
        }
      }
    } catch (e) {
      console.warn('Telegram WebApp init check:', e);
    }
  }, []);

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
    try {
      const tg = window.Telegram?.WebApp?.HapticFeedback;
      if (tg) {
        if (type === 'success' || type === 'warning' || type === 'error') {
          tg.notificationOccurred(type);
        } else {
          tg.impactOccurred(type);
        }
      } else if (navigator.vibrate) {
        if (type === 'heavy' || type === 'error') navigator.vibrate(25);
        else if (type === 'medium' || type === 'warning') navigator.vibrate(15);
        else navigator.vibrate(8);
      }
    } catch (_) {}
  };

  const openTelegramLink = (url: string) => {
    try {
      if (window.Telegram?.WebApp?.openTelegramLink) {
        window.Telegram.WebApp.openTelegramLink(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (_) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const switchDemoUser = (index: number) => {
    const selected = DEMO_USERS[index % DEMO_USERS.length];
    setUser(selected);
    haptic('medium');
  };

  return (
    <TelegramContext.Provider
      value={{
        user,
        isInsideTelegram,
        haptic,
        openTelegramLink,
        setUser,
        switchDemoUser
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
