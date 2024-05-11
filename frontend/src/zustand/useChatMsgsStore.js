import { create } from "zustand";

export const useChatMsgsStore = create((set) => ({
  chatMsgs: [],
  isChatMsgTabActive: true,
  updateChatMsgs: (chatMsgs) => set({ chatMsgs }),
  updateIsChatMsgTabActive: (isActive) => set({ isChatMsgTabActive: isActive }),
}));
