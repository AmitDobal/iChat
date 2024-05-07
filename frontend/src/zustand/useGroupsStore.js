const { create } = require("zustand");

export const useGroupsStore = create((set) => ({
  groups: [],
  updateGroups: (groups) => set({ groups: groups }),
}));
