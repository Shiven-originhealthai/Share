// store/UserMediaStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePosting } from '@/store/Posting';

type MediaStore = {
  selectedPaths: string[];
  postedPaths: string[];
  addPath: (path: string) => void;
  removePath: (path: string) => void;
  togglePath: (path: string) => void;
  clearPaths: () => void;
  storePostedPaths: () => void;
};

export const useMediaStore = create<MediaStore>()(
  
  persist(
    (set, get) => ({
      selectedPaths: [],
      postedPaths: [],

      addPath: (path) =>
        set((state) =>
          state.selectedPaths.includes(path)
            ? state
            : { selectedPaths: [...state.selectedPaths, path] }
        ),

      removePath: (path) =>
        set((state) => ({
          selectedPaths: state.selectedPaths.filter((p) => p !== path),
        })),

      togglePath: (path) =>
        set((state) =>
          state.selectedPaths.includes(path)
            ? { selectedPaths: state.selectedPaths.filter((p) => p !== path) }
            : { selectedPaths: [...state.selectedPaths, path] }
        ),

      clearPaths: () => set({ selectedPaths: [] }),

      storePostedPaths: () => {
        const selected = get().selectedPaths;
        set({ postedPaths: [...selected] });
      }
    }),
    {
      name: 'media-store', // localStorage key
    }
  )
);