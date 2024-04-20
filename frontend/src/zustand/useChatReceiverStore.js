import { create } from "zustand";

export const useChatReceiverStore = create((set) => ({
  chatReceiver: "",
  chatReceiverPicURL: "",
  updateChatReceiver: (chatReceiver) => set({ chatReceiver: chatReceiver }),
  updateChatReceiverPicURL: (url) => set({ chatReceiverPicURL: url }),
}));
