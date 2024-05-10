import { persist } from "zustand/middleware";
const { create } = require("zustand");

export const useNotificationsStore = create(
  persist(
    (set) => ({
      unreadMsgs: {},
      updateUnreadMsgs: (unreadMsgs) => set({ unreadMsgs }),
      clearNotifications: () => set({ unreadMsgs: {} }),
    }),
    {
      name: "ichat-notifications",
    }
  )
);
