const { create } = require("zustand");

const useUsersStore = create((set) => ({
  users: [],
  updateUsers: (user) => set({ users: user }),
}));

export default useUsersStore;
