import { useRoute } from 'vue-router';

import { useAccessStore } from '@vben/stores';

// User permissions related operations
export function usePermission() {
  const accessStore = useAccessStore();

  const { permissionList } = accessStore;
  const route = useRoute();

  // 确定是否有列表权限
  function hasColumnPermission(value?: string, def = true, modelId?: string): boolean {
    if (!value) return def;
    const currentModelId = modelId || route.meta.modelId || '';
    if (!currentModelId) return false;
    const list = permissionList.filter((o) => o.modelId === currentModelId);
    if (list.length === 0) return false;
    const columnList = list[0] && list[0].column ? list[0].column : [];
    if (columnList.length === 0) return false;
    const hasPermission = columnList.some((column) => column.enCode === value);
    if (hasPermission) return true;
    return false;
  }

  // 确定是否有表单权限
  function hasFormPermission(value?: string, def = true, modelId?: string): boolean {
    if (!value) return def;
    const currentModelId = modelId || route.meta.modelId || '';
    if (!currentModelId) return false;
    const list = permissionList.filter((o) => o.modelId === currentModelId);
    if (list.length === 0) return false;
    const formList = list[0] && list[0].form ? list[0].form : [];
    if (formList.length === 0) return false;
    const hasPermission = formList.some((form) => form.enCode === value);
    if (hasPermission) return true;
    return false;
  }

  // 确定是否有按钮权限
  function hasBtnPermission(value?: string, def = true, modelId?: string): boolean {
    if (!value) return def;
    const currentModelId = modelId || route.meta.modelId || '';
    if (!currentModelId) return false;
    const list = permissionList.filter((o) => o.modelId === currentModelId);
    if (list.length === 0) return false;
    const btnList = list[0] && list[0].button ? list[0].button : [];
    if (btnList.length === 0) return false;
    const hasPermission = btnList.some((btn) => btn.enCode === value);
    if (hasPermission) return true;
    return false;
  }

  return {
    hasBtnP: hasBtnPermission,
    hasColumnP: hasColumnPermission,
    hasFormP: hasFormPermission,
  };
}
