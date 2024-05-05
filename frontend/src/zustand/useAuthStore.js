import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// export const useAuthStore = create((set) => ({
//   authName: "",
//   authPicURL:"",
//   updateAuthName: (name) => set({ authName: name }),
//   updatePicURL: (url) => set({ authPicURL: url }),
// }));

export const useAuthStore = create(
  persist(
    (set) => ({
      authName: "",
      authPicURL: "",
      updateAuthName: (name) => set({ authName: name }),
      updatePicURL: (url) => set({ authPicURL: url }),
      clearAuthData: () => set({ authName: "", authPicURL: "" }),
    }),
    {
      name: "auth-storage", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
