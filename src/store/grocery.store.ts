import { create } from "zustand";

export interface GroceryItem {
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

interface GroceryStore {
  items: GroceryItem[];
  listId: string | null;
  setList: (id: string, items: GroceryItem[]) => void;
  toggleItem: (name: string) => void;
  clearList: () => void;
}

export const useGroceryStore = create<GroceryStore>((set) => ({
  items: [],
  listId: null,
  setList: (id, items) => set({ listId: id, items }),
  toggleItem: (name) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.name === name ? { ...item, checked: !item.checked } : item
      ),
    })),
  clearList: () => set({ items: [], listId: null }),
}));
