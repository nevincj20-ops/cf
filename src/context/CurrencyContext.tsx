import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CurrencyConfig } from '../types/tvm';
import { CURRENCY_CONFIGS, formatCurrency } from '../utils/formatting';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  config: CurrencyConfig;
  symbol: string;
  format: (value: number, options?: { compact?: boolean; maximumFractionDigits?: number }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('tvm_currency');
    return (saved && saved in CURRENCY_CONFIGS) ? (saved as CurrencyCode) : 'INR';
  });

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('tvm_currency', c);
  };

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;

  const format = (value: number, options?: { compact?: boolean; maximumFractionDigits?: number }) => {
    return formatCurrency(value, currency, options);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        config,
        symbol: config.symbol,
        format,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
