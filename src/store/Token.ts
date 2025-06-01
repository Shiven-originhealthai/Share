import { create } from 'zustand';

type Token = {
  extractedToken: string;
  setToken: (value: string) => void;
};

export const useTokenSetter = create<Token>((set) => ({
  extractedToken: '',
  setToken: (value: string) => set({ extractedToken: value }),
}));
