import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'JPY';

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number;
}

const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  NGN: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira', rate: 1 },
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', rate: 0.00066 },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.00052 },
  JPY: { code: 'JPY', symbol: '¥', label: 'Japanese Yen', rate: 0.099 },
};

const STORAGE_KEY = 'eclection_currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  format: (amount: number) => string;
  convert: (amount: number) => number;
  currencies: typeof CURRENCIES;
  info: CurrencyInfo;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      return (localStorage.getItem(STORAGE_KEY) as CurrencyCode) || 'NGN';
    } catch { return 'NGN'; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const setCurrency = (code: CurrencyCode) => setCurrencyState(code);

  const info = CURRENCIES[currency];

  const convert = (amount: number): number => {
    return Math.round(amount * info.rate * 100) / 100;
  };

  const format = (amount: number): string => {
    const converted = convert(amount);
    if (currency === 'JPY') {
      return `${info.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${info.symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert, currencies: CURRENCIES, info }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
