import { create } from 'zustand';

type UIState = {
  selectedIncidentId?: string;
  setSelectedIncident: (id?: string) => void;
};

export const useUiStore = create<UIState>((set) => ({
  selectedIncidentId: undefined,
  setSelectedIncident: (id) => set({ selectedIncidentId: id }),
}));
