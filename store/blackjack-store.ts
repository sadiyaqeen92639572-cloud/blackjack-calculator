import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SimulationRunSummary {
  id: string;
  ranAt: number;
  numHands: number;
  realizedEdgePct: number;
  ruleLabel: string;
}

interface BlackjackStore {
  runHistory: SimulationRunSummary[];
  addRun: (run: SimulationRunSummary) => void;
  clearHistory: () => void;
}

const MAX_RUNS = 50;

export const useBlackjackStore = create<BlackjackStore>()(
  persist(
    (set) => ({
      runHistory: [],
      addRun: (run) =>
        set((state) => ({
          runHistory: [run, ...state.runHistory].slice(0, MAX_RUNS),
        })),
      clearHistory: () => set({ runHistory: [] }),
    }),
    {
      name: 'blackjack-store',
      skipHydration: true,
      partialize: (state) => ({ runHistory: state.runHistory.slice(0, MAX_RUNS) }),
    }
  )
);
