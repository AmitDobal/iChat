const { create } = require("zustand");

export const useGroupsStore = create((set) => ({
  groups: [],
  selectedGroup: {},
  updateGroups: (groups) => set({ groups: groups }),
  updateSelectedGroup: (selectedGroup) => set({ selectedGroup }),
}));
