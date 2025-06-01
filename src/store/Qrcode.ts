import { create } from 'zustand';

type QRCodeUrl = {
    url: string[]
    toggeUrl: (url: string) => void
    removePath: () => void
};

export const useQrCodeUrl = create<QRCodeUrl>((set) => ({
    url: [],
    toggeUrl: (path) =>
        set((state) =>
            state.url.includes(path)
                ? state
                : { url: [...state.url, path] }
        ),
    removePath: () =>
        set((state)=>({
            url:state.url.slice(0,-1),
        })),

}));
