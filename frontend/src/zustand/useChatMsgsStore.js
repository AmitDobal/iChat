import { create } from "zustand";

export const useChatMsgsStore = create((set) => ({
  chatMsgs: [],
  updateChatMsgs: (chatMsgs) => set({ chatMsgs }),
}));
// export const useChatMsgsStore = create((set) => ({
//   chatMsgs: [],
//   updateChatMsgs: (chatMsgs) => {
//     set(state => ({
//       chatMsgs: [...state.chatMsgs, chatMsgs]
//     }));
//   },
// }));
