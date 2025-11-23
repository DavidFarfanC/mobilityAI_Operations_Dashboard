import { create } from 'zustand'

type UIState = {
  selectedIncidentId?: string
  setSelectedIncident: (id?: string) => void
  selectedLine: 'all' | 'L1' | 'L2'
  setSelectedLine: (line: 'all' | 'L1' | 'L2') => void
  showTrains: boolean
  setShowTrains: (show: boolean) => void
  showIncidents: boolean
  setShowIncidents: (show: boolean) => void
}

export const useUiStore = create<UIState>((set) => ({
  selectedIncidentId: undefined,
  setSelectedIncident: (id) => set({ selectedIncidentId: id }),
  selectedLine: 'all',
  setSelectedLine: (line) => set({ selectedLine: line }),
  showTrains: true,
  setShowTrains: (show) => set({ showTrains: show }),
  showIncidents: true,
  setShowIncidents: (show) => set({ showIncidents: show }),
}))
