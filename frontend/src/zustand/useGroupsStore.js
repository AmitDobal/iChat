const { create } = require("zustand");

export const useGroupsStore = create((set) => ({
  groups: [],
  selectedGroup: {},
  updateGroups: (groups) => set({ groups: groups }),
  updateSelectedGroup: (selectedGroup) => set({ selectedGroup }),
  removeUserFromGroup: (groupId, userId) => {
    set((state) => {
      let selectGrp = {};
      const updatedGroups = state.groups.map((group) => {
        if (group._id === groupId) {
          const data = {
            ...group,
            users: group.users.filter((user) => user._id !== userId),
          };
          selectGrp = data;
          return data;
        }
        return group;
      });
      return { groups: updatedGroups, selectedGroup: selectGrp };
    });
  },
}));
