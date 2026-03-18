import { create } from "zustand";
import { ViewSection, SortField, SortDirection, UsagePattern } from "./types";

interface AppState {
  activeSection: ViewSection;
  setActiveSection: (section: ViewSection) => void;

  sortField: SortField;
  sortDirection: SortDirection;
  setSorting: (field: SortField, direction: SortDirection) => void;

  providerFilter: string[];
  setProviderFilter: (providers: string[]) => void;
  toggleProvider: (provider: string) => void;

  modalityFilter: string;
  setModalityFilter: (modality: string) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  usagePattern: UsagePattern;
  setUsagePattern: (pattern: Partial<UsagePattern>) => void;

  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSection: "pricing",
  setActiveSection: (section) => set({ activeSection: section }),

  sortField: "qualityScore",
  sortDirection: "desc",
  setSorting: (field, direction) => set({ sortField: field, sortDirection: direction }),

  providerFilter: [],
  setProviderFilter: (providers) => set({ providerFilter: providers }),
  toggleProvider: (provider) =>
    set((state) => ({
      providerFilter: state.providerFilter.includes(provider)
        ? state.providerFilter.filter((p) => p !== provider)
        : [...state.providerFilter, provider],
    })),

  modalityFilter: "all",
  setModalityFilter: (modality) => set({ modalityFilter: modality }),

  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  usagePattern: {
    avgInputTokens: 1000,
    avgOutputTokens: 500,
    requestsPerDay: 100,
    prioritySpeed: 5,
    priorityQuality: 7,
    priorityCost: 8,
    useCase: "general",
  },
  setUsagePattern: (pattern) =>
    set((state) => ({ usagePattern: { ...state.usagePattern, ...pattern } })),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
