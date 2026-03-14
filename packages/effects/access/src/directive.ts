/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="'btn-edit'"
 */
import type { App, Directive, DirectiveBinding } from 'vue';

import { useAccessStore } from '@vben/stores';

function hasBtnP(modelId, value?: string): boolean {
  if (!value) return true;
  if (!modelId) return false;
  const accessStore = useAccessStore();
  const permissionList = accessStore.permissionList;
  const list = permissionList.filter((o) => o.modelId === modelId);
  if (!list.length) return false;
  const btnList = list[0] && list[0].button ? list[0].button : [];
  if (!btnList.length) return false;
  const hasPermission = btnList.some((btn) => btn.enCode === value);
  if (hasPermission) return true;
  return false;
}

function isAuth(el: Element, binding: any, VNode) {
  const value = binding.value;
  const modelId = VNode.ctx.proxy.$route.meta.modelId || '';
  if (!value) return;
  if (!hasBtnP(modelId, value)) {
    el?.remove();
  }
}

const mounted = (el: Element, binding: DirectiveBinding<string | string[]>, VNode) => {
  isAuth(el, binding, VNode);
};

const authDirective: Directive = {
  mounted,
};

export function registerAccessDirective(app: App) {
  app.directive('auth', authDirective);
}
