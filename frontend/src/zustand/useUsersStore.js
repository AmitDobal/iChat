const { create } = require("zustand");

export const useUsersStore = create((set) => ({
  users: [],
  activeUsers: [],
  activeUsersMap:{},
  updateUsers: (users) => set({ users: users }),
  updateActiveUsers: (users) => set({ activeUsers: [...users] }),
  updateActiveUsersMap: (users) => set({ activeUsers: users }),
}));

// export const useActiveUsersStore = create((set) => ({
//   activeUsers: [],
//   updateActiveUsers: (user) => set({ activeUsers: user }),
// }));

