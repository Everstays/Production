import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import PageLoader from '../components/common/PageLoader';

interface GlobalLoaderContextValue {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

const GlobalLoaderContext = createContext<GlobalLoaderContextValue | null>(null);

export function GlobalLoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoadingState] = useState(false);
  const setLoading = useCallback((value: boolean) => {
    setLoadingState(value);
  }, []);

  return (
    <GlobalLoaderContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && <PageLoader fullScreen />}
    </GlobalLoaderContext.Provider>
  );
}

export function useGlobalLoader() {
  const ctx = useContext(GlobalLoaderContext);
  if (!ctx) return { loading: false, setLoading: () => {} };
  return ctx;
}
