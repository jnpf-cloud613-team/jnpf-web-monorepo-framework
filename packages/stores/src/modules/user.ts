import type { BasicUserInfo } from '@vben-core/typings';

import { mergeWithArrayOverride } from '@vben-core/shared/utils';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface UserState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: null | Partial<BasicUserInfo>) {
      // 设置用户信息
      this.userInfo = mergeWithArrayOverride(userInfo || {}, this.userInfo || {}) as BasicUserInfo;
    },
  },
  getters: {
    getUserInfo(): BasicUserInfo | null {
      return this.userInfo || null;
    },
  },
  state: (): UserState => ({
    userInfo: null,
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
