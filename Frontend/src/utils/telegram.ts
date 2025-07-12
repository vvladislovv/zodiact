declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: unknown;
        ready: () => void;
        expand: () => void;
      };
    };
  }
}

export const initializeTelegramApp = () => {
  if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    return true;
  }
  return false;
};
