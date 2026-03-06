import { createContext, useState, useCallback, type ReactNode } from 'react';

interface DevModeContextValue {
  isDevMode: boolean;
  isPanelOpen: boolean;
  unlock: (password: string) => boolean;
  lock: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

export const DevModeContext = createContext<DevModeContextValue>({
  isDevMode: false,
  isPanelOpen: false,
  unlock: () => false,
  lock: () => {},
  openPanel: () => {},
  closePanel: () => {},
});

const DEV_PASSWORD = '602390';

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [isDevMode, setIsDevMode] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const unlock = useCallback((password: string): boolean => {
    if (password === DEV_PASSWORD) {
      setIsDevMode(true);
      setIsPanelOpen(true);
      return true;
    }
    return false;
  }, []);

  const lock = useCallback(() => {
    setIsDevMode(false);
    setIsPanelOpen(false);
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  return (
    <DevModeContext.Provider value={{ isDevMode, isPanelOpen, unlock, lock, openPanel, closePanel }}>
      {children}
    </DevModeContext.Provider>
  );
}
