const { create } = require("zustand");

export const useUsersStore = create((set) => ({
  users: [],
  updateUsers: (users) => set({ users: users }),
}));
