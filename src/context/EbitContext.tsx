import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  FinancingPlan,
  BreakEvenResult,
  ScenarioResult,
  PlanCalculationWorking,
  ValidationResult,
} from '../engine/types';
import {
  SAMPLE_ACADEMIC_PLAN_A,
  SAMPLE_ACADEMIC_PLAN_B,
  SAMPLE_EXPECTED_EBIT,
  EMPTY_PLAN_A,
  EMPTY_PLAN_B,
} from '../engine/defaults';
import {
  calculateBreakEvenEBIT,
  evaluateScenario,
  calculatePlanWorking,
  calculateInterest,
  calculatePreferenceDividend,
} from '../engine/calculations';
import { validateBothPlans } from '../engine/validation';

export type NavTab = 'dashboard' | 'analyzer' | 'sensitivity' | 'formula-guide' | 'reports';

interface EbitContextType {
  planA: FinancingPlan;
  planB: FinancingPlan;
  expectedEbit: number;
  academicMode: boolean;
  activeTab: NavTab;
  updatePlanA: (updates: Partial<FinancingPlan>) => void;
  updatePlanB: (updates: Partial<FinancingPlan>) => void;
  setExpectedEbit: (ebit: number) => void;
  setAcademicMode: (mode: boolean | ((prev: boolean) => boolean)) => void;
  setActiveTab: (tab: NavTab) => void;
  resetToSample: () => void;
  clearAll: () => void;

  // Computed state
  validation: ValidationResult;
  breakEvenResult: BreakEvenResult;
  scenarioResult: ScenarioResult;
  planA_Working: PlanCalculationWorking;
  planB_Working: PlanCalculationWorking;
}

const EbitContext = createContext<EbitContextType | undefined>(undefined);

export const EbitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [planA, setPlanA] = useState<FinancingPlan>(SAMPLE_ACADEMIC_PLAN_A);
  const [planB, setPlanB] = useState<FinancingPlan>(SAMPLE_ACADEMIC_PLAN_B);
  const [expectedEbit, setExpectedEbit] = useState<number>(SAMPLE_EXPECTED_EBIT);
  const [academicMode, setAcademicMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  const updatePlanA = (updates: Partial<FinancingPlan>) => {
    setPlanA((prev) => {
      const next = { ...prev, ...updates };
      // Keep totalShares synced
      next.totalShares = (next.existingShares || 0) + (next.newShares || 0);
      // Auto calculate interest if not manual
      if (!next.isManualInterest) {
        next.interestAmount = calculateInterest(next.debtAmount, next.interestRate, false);
      }
      // Auto calculate preference dividend if not manual
      if (!next.isManualPrefDividend) {
        next.preferenceDividend = calculatePreferenceDividend(
          next.preferenceShares,
          next.preferenceDividendRate,
          false
        );
      }
      return next;
    });
  };

  const updatePlanB = (updates: Partial<FinancingPlan>) => {
    setPlanB((prev) => {
      const next = { ...prev, ...updates };
      // Keep totalShares synced
      next.totalShares = (next.existingShares || 0) + (next.newShares || 0);
      // Auto calculate interest if not manual
      if (!next.isManualInterest) {
        next.interestAmount = calculateInterest(next.debtAmount, next.interestRate, false);
      }
      // Auto calculate preference dividend if not manual
      if (!next.isManualPrefDividend) {
        next.preferenceDividend = calculatePreferenceDividend(
          next.preferenceShares,
          next.preferenceDividendRate,
          false
        );
      }
      return next;
    });
  };

  const resetToSample = () => {
    setPlanA(SAMPLE_ACADEMIC_PLAN_A);
    setPlanB(SAMPLE_ACADEMIC_PLAN_B);
    setExpectedEbit(SAMPLE_EXPECTED_EBIT);
  };

  const clearAll = () => {
    setPlanA(EMPTY_PLAN_A);
    setPlanB(EMPTY_PLAN_B);
    setExpectedEbit(0);
  };

  // Memoized calculations
  const validation = useMemo(() => validateBothPlans(planA, planB), [planA, planB]);

  const breakEvenResult = useMemo(() => {
    return calculateBreakEvenEBIT(planA, planB);
  }, [planA, planB]);

  const scenarioResult = useMemo(() => {
    return evaluateScenario(planA, planB, expectedEbit);
  }, [planA, planB, expectedEbit]);

  const planA_Working = useMemo(() => {
    return calculatePlanWorking(planA, expectedEbit);
  }, [planA, expectedEbit]);

  const planB_Working = useMemo(() => {
    return calculatePlanWorking(planB, expectedEbit);
  }, [planB, expectedEbit]);

  return (
    <EbitContext.Provider
      value={{
        planA,
        planB,
        expectedEbit,
        academicMode,
        activeTab,
        updatePlanA,
        updatePlanB,
        setExpectedEbit,
        setAcademicMode,
        setActiveTab,
        resetToSample,
        clearAll,
        validation,
        breakEvenResult,
        scenarioResult,
        planA_Working,
        planB_Working,
      }}
    >
      {children}
    </EbitContext.Provider>
  );
};

export function useEbit() {
  const context = useContext(EbitContext);
  if (!context) {
    throw new Error('useEbit must be used within an EbitProvider');
  }
  return context;
}
