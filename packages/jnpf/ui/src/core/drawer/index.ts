import { withInstall } from '@jnpf/utils';

import basicDrawer from './src/BasicDrawer.vue';
import drawerFooter from './src/components/DrawerFooter.vue';

export const BasicDrawer = withInstall(basicDrawer);
export const DrawerFooter = withInstall(drawerFooter);
export * from './src/typing';
export { useDrawer, useDrawerInner } from './src/useDrawer';
