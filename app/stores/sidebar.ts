export type SidebarItem = {
  id: number;
  label: string;
  icon: string;
  href: string;
};
export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const loading = ref(false);
  return {
    sidebarItems,
    loading,
  };
});
