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

const GUEST_ID_KEY = 'babi_store_guest_uuid';

/**
 * Get existing persistent guest ID or generate a new unique random UUID for this device/browser
 */
export function getOrCreateGuestId(): string {
  try {
    const existing = localStorage.getItem(GUEST_ID_KEY);
    if (existing && existing.startsWith('guest_')) {
      return existing;
    }
    const newId = `guest_${
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    }`;
    localStorage.setItem(GUEST_ID_KEY, newId);
    return newId;
  } catch (e) {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}

interface TelegramContextType {
  user: TelegramUser;
  guestId: string;
  isInsideTelegram: boolean;
  isGuest: boolean;
  haptic: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => void;
  openTelegramLink: (url: string) => void;
  setUser: (user: TelegramUser) => void;
  switchDemoUser: (index: number) => void;
}

// Development preview users for testing multi-user isolation
const TEST_TELEGRAM_USERS: TelegramUser[] = [
  {
    id: 100000001,
    username: 'tester_alpha',
    first_name: 'Tester',
    last_name: 'Alpha',
    is_premium: true,
    is_guest: false
  },
  {
    id: 100000002,
    username: 'tester_beta',
    first_name: 'Tester',
    last_name: 'Beta',
    is_premium: false,
    is_guest: false
  }
];

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guestId, setGuestId] = useState<string>(() => getOrCreateGuestId());
  const [isInsideTelegram, setIsInsideTelegram] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<TelegramUser>(() => ({
    id: 0,
    username: '',
    first_name: 'Guest',
    last_name: '',
    is_guest: true,
    guest_id: getOrCreateGuestId()
  }));

  useEffect(() => {
    try {
      const gid = getOrCreateGuestId();
      setGuestId(gid);

      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        try {
          tg.setHeaderColor('#090a0f');
          tg.setBackgroundColor('#090a0f');
        } catch (_) {}

        // Check if opened with a valid Telegram user session
        if (tg.initDataUnsafe?.user?.id) {
          const realUser: TelegramUser = {
            ...tg.initDataUnsafe.user,
            is_guest: false
          };
          setUser(realUser);
          setIsInsideTelegram(true);
          setIsGuest(false);
        } else if (tg.initData) {
          setIsInsideTelegram(true);
        }
      }
    } catch (e) {
      console.warn('Telegram WebApp init check error:', e);
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
    const selected = TEST_TELEGRAM_USERS[index % TEST_TELEGRAM_USERS.length];
    setUser(selected);
    setIsGuest(false);
    haptic('medium');
  };

  return (
    <TelegramContext.Provider
      value={{
        user,
        guestId,
        isInsideTelegram,
        isGuest,
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

