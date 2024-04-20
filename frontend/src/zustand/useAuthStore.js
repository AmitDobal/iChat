import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authName: "",
  authPicURL:"",
  updateAuthName: (name) => set({ authName: name }),
  updatePicURL: (url) => set({ authPicURL: url }),
}));
