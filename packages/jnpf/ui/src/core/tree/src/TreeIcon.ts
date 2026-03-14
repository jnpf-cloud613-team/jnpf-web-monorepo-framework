import type { VNode } from 'vue';

import { h } from 'vue';

import { isString } from '@jnpf/utils';

import { VbenIcon } from '@vben-core/shadcn-ui';

export const TreeIcon: any = ({ icon }: { icon: string | VNode }) => {
  if (!icon) return null;
  if (isString(icon)) {
    return h('i', { class: `icon-my mr-[6px] ${icon}` });
  }
  return VbenIcon;
};
