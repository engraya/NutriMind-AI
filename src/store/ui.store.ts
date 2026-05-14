import { create } from "zustand";

interface UIStore {
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
}));

export const useCommandPaletteStore = () => {
  const { commandPaletteOpen: open, setCommandPaletteOpen: setOpen } =
    useUIStore();
  return { open, setOpen };
};
