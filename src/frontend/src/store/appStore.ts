import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LabHistoryEntry {
  id: string;
  experimentName: string;
  timestamp: number;
  result: string;
}

interface AppState {
  theme: "dark" | "light";
  searchQuery: string;
  activeSection: string;
  favorites: number[];
  recentElements: number[];
  labHistory: LabHistoryEntry[];

  setTheme: (theme: "dark" | "light") => void;
  setSearchQuery: (query: string) => void;
  setActiveSection: (section: string) => void;
  toggleFavorite: (atomicNumber: number) => void;
  addRecentElement: (atomicNumber: number) => void;
  addLabHistory: (entry: Omit<LabHistoryEntry, "id" | "timestamp">) => void;
  clearLabHistory: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: "light",
      searchQuery: "",
      activeSection: "home",
      favorites: [],
      recentElements: [],
      labHistory: [],

      setTheme: (theme) => set({ theme }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveSection: (activeSection) => set({ activeSection }),

      toggleFavorite: (atomicNumber) => {
        const { favorites } = get();
        if (favorites.includes(atomicNumber)) {
          set({ favorites: favorites.filter((n) => n !== atomicNumber) });
        } else {
          set({ favorites: [...favorites, atomicNumber] });
        }
      },

      addRecentElement: (atomicNumber) => {
        const { recentElements } = get();
        const filtered = recentElements.filter((n) => n !== atomicNumber);
        set({ recentElements: [atomicNumber, ...filtered].slice(0, 10) });
      },

      addLabHistory: (entry) => {
        const newEntry: LabHistoryEntry = {
          ...entry,
          id: `lab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          labHistory: [newEntry, ...state.labHistory].slice(0, 50),
        }));
      },

      clearLabHistory: () => set({ labHistory: [] }),
    }),
    {
      name: "zchemistry-lab-store",
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        recentElements: state.recentElements,
        labHistory: state.labHistory,
      }),
    },
  ),
);
