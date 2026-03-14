<script setup lang="ts">
import type {
  BuiltinThemeType,
  LayoutHeaderMenuAlignType,
  LayoutHeaderModeType,
  LayoutType,
  NavigationStyleType,
  PreferencesButtonPositionType,
  ThemeBgType,
  ThemeModeType,
} from '@vben/types';

import type { SegmentedItem } from '@vben-core/shadcn-ui';

import { computed, ref } from 'vue';

import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { useVbenDrawer } from '@vben-core/popup-ui';
import { VbenSegmented } from '@vben-core/shadcn-ui';

import { Animation, BgTheme, Block, BuiltinTheme, ColorMode, General, Header, Layout, Navigation, Sidebar, Tabbar, Theme, Widget } from './blocks';

const appDynamicTitle = defineModel<boolean>('appDynamicTitle');
const appLayout = defineModel<LayoutType>('appLayout');
const appColorGrayMode = defineModel<boolean>('appColorGrayMode');
const appColorWeakMode = defineModel<boolean>('appColorWeakMode');
const appWatermark = defineModel<boolean>('appWatermark');
const appPreferencesButtonPosition = defineModel<PreferencesButtonPositionType>('appPreferencesButtonPosition');

const transitionProgress = defineModel<boolean>('transitionProgress');
const transitionName = defineModel<string>('transitionName');
const transitionLoading = defineModel<boolean>('transitionLoading');
const transitionEnable = defineModel<boolean>('transitionEnable');

const themeColorPrimary = defineModel<string>('themeColorPrimary');
const themeBuiltinType = defineModel<BuiltinThemeType>('themeBuiltinType');
const themeBgType = defineModel<ThemeBgType>('themeBgType');
const themeMode = defineModel<ThemeModeType>('themeMode');
const themeSemiDarkSidebar = defineModel<boolean>('themeSemiDarkSidebar');
const themeSemiDarkHeader = defineModel<boolean>('themeSemiDarkHeader');

const sidebarEnable = defineModel<boolean>('sidebarEnable');
const sidebarWidth = defineModel<number>('sidebarWidth');
const sidebarCollapsed = defineModel<boolean>('sidebarCollapsed');
const sidebarCollapsedShowTitle = defineModel<boolean>('sidebarCollapsedShowTitle');
const sidebarAutoActivateChild = defineModel<boolean>('sidebarAutoActivateChild');
const sidebarExpandOnHover = defineModel<boolean>('sidebarExpandOnHover');
const sidebarCollapsedButton = defineModel<boolean>('sidebarCollapsedButton');
const sidebarFixedButton = defineModel<boolean>('sidebarFixedButton');
const headerEnable = defineModel<boolean>('headerEnable');
const headerMode = defineModel<LayoutHeaderModeType>('headerMode');
const headerMenuAlign = defineModel<LayoutHeaderMenuAlignType>('headerMenuAlign');

const tabbarEnable = defineModel<boolean>('tabbarEnable');
const tabbarShowIcon = defineModel<boolean>('tabbarShowIcon');
const tabbarShowMore = defineModel<boolean>('tabbarShowMore');
const tabbarShowMaximize = defineModel<boolean>('tabbarShowMaximize');
const tabbarDraggable = defineModel<boolean>('tabbarDraggable');
const tabbarWheelable = defineModel<boolean>('tabbarWheelable');
const tabbarStyleType = defineModel<string>('tabbarStyleType');
const tabbarMaxCount = defineModel<number>('tabbarMaxCount');
const tabbarMiddleClickToClose = defineModel<boolean>('tabbarMiddleClickToClose');

const navigationStyleType = defineModel<NavigationStyleType>('navigationStyleType');
const navigationSplit = defineModel<boolean>('navigationSplit');
const navigationAccordion = defineModel<boolean>('navigationAccordion');

const widgetGlobalSearch = defineModel<boolean>('widgetGlobalSearch');
const widgetFullscreen = defineModel<boolean>('widgetFullscreen');
const widgetLanguageToggle = defineModel<boolean>('widgetLanguageToggle');
const widgetThemeToggle = defineModel<boolean>('widgetThemeToggle');
const widgetSidebarToggle = defineModel<boolean>('widgetSidebarToggle');
const widgetLockScreen = defineModel<boolean>('widgetLockScreen');
const widgetRefresh = defineModel<boolean>('widgetRefresh');

const { isDark, isFullContent, isMixedNav, isSideMode } = usePreferences();

const [Drawer] = useVbenDrawer();

const activeTab = ref('appearance');

const tabs = computed((): SegmentedItem[] => {
  return [
    {
      label: $t('preferences.appearance'),
      value: 'appearance',
    },
    {
      label: $t('preferences.layout'),
      value: 'layout',
    },
    {
      label: $t('preferences.general'),
      value: 'general',
    },
  ];
});
</script>

<template>
  <div>
    <Drawer :description="$t('preferences.subtitle')" :title="$t('preferences.title')" class="sm:max-w-sm" :footer="false">
      <div class="p-1">
        <VbenSegmented v-model="activeTab" :tabs="tabs">
          <template #general>
            <Block :title="$t('preferences.general')">
              <General v-model:app-dynamic-title="appDynamicTitle" v-model:app-watermark="appWatermark" />
            </Block>

            <Block :title="$t('preferences.animation.title')">
              <Animation
                v-model:transition-enable="transitionEnable"
                v-model:transition-loading="transitionLoading"
                v-model:transition-name="transitionName"
                v-model:transition-progress="transitionProgress" />
            </Block>
          </template>
          <template #appearance>
            <Block :title="$t('preferences.theme.title')">
              <Theme v-model="themeMode" v-model:theme-semi-dark-header="themeSemiDarkHeader" v-model:theme-semi-dark-sidebar="themeSemiDarkSidebar" />
            </Block>
            <Block :title="$t('preferences.theme.builtin.title')">
              <BuiltinTheme v-model="themeBuiltinType" v-model:theme-color-primary="themeColorPrimary" :is-dark="isDark" />
            </Block>
            <Block :title="$t('preferences.theme.bgType.title')">
              <BgTheme v-model="themeBgType" />
            </Block>
            <Block :title="$t('preferences.other')">
              <ColorMode v-model:app-color-gray-mode="appColorGrayMode" v-model:app-color-weak-mode="appColorWeakMode" />
            </Block>
          </template>
          <template #layout>
            <Block :title="$t('preferences.layout')">
              <Layout v-model="appLayout" />
            </Block>

            <Block :title="$t('preferences.sidebar.title')">
              <Sidebar
                v-model:sidebar-auto-activate-child="sidebarAutoActivateChild"
                v-model:sidebar-collapsed="sidebarCollapsed"
                v-model:sidebar-collapsed-show-title="sidebarCollapsedShowTitle"
                v-model:sidebar-enable="sidebarEnable"
                v-model:sidebar-expand-on-hover="sidebarExpandOnHover"
                v-model:sidebar-width="sidebarWidth"
                v-model:sidebar-collapsed-button="sidebarCollapsedButton"
                v-model:sidebar-fixed-button="sidebarFixedButton"
                :current-layout="appLayout"
                :disabled="!isSideMode" />
            </Block>

            <Block :title="$t('preferences.header.title')">
              <Header
                v-model:header-enable="headerEnable"
                v-model:header-menu-align="headerMenuAlign"
                v-model:header-mode="headerMode"
                :disabled="isFullContent" />
            </Block>

            <Block :title="$t('preferences.navigationMenu.title')">
              <Navigation
                v-model:navigation-accordion="navigationAccordion"
                v-model:navigation-split="navigationSplit"
                v-model:navigation-style-type="navigationStyleType"
                :disabled="isFullContent"
                :disabled-navigation-split="!isMixedNav" />
            </Block>
            <Block :title="$t('preferences.tabbar.title')">
              <Tabbar
                v-model:tabbar-draggable="tabbarDraggable"
                v-model:tabbar-enable="tabbarEnable"
                v-model:tabbar-show-icon="tabbarShowIcon"
                v-model:tabbar-show-maximize="tabbarShowMaximize"
                v-model:tabbar-show-more="tabbarShowMore"
                v-model:tabbar-style-type="tabbarStyleType"
                v-model:tabbar-wheelable="tabbarWheelable"
                v-model:tabbar-max-count="tabbarMaxCount"
                v-model:tabbar-middle-click-to-close="tabbarMiddleClickToClose" />
            </Block>
            <Block :title="$t('preferences.widget.title')">
              <Widget
                v-model:app-preferences-button-position="appPreferencesButtonPosition"
                v-model:widget-fullscreen="widgetFullscreen"
                v-model:widget-global-search="widgetGlobalSearch"
                v-model:widget-language-toggle="widgetLanguageToggle"
                v-model:widget-lock-screen="widgetLockScreen"
                v-model:widget-refresh="widgetRefresh"
                v-model:widget-sidebar-toggle="widgetSidebarToggle"
                v-model:widget-theme-toggle="widgetThemeToggle" />
            </Block>
          </template>
        </VbenSegmented>
      </div>
    </Drawer>
  </div>
</template>
