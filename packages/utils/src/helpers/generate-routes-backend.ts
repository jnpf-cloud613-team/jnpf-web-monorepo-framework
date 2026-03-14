/* eslint-disable no-template-curly-in-string */
import type { RouteRecordRaw } from 'vue-router';

import type { BackMenu, ComponentRecordType, GenerateMenuAndRoutesOptions } from '@vben-core/typings';

import { defineAsyncComponent, defineComponent, h } from 'vue';

import { mapTree } from '@vben-core/shared/utils';

import qs from 'qs';

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(options: GenerateMenuAndRoutesOptions): Promise<RouteRecordRaw[]> {
  const { layoutMap = {}, pageMap = {}, backMenus = [] } = options;

  try {
    const menuRoutes = backMenus;
    if (!menuRoutes) {
      return [];
    }

    const normalizePageMap: ComponentRecordType = {};

    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }

    const routes = convertRoutes(menuRoutes, layoutMap, normalizePageMap, options.globSetting, options.token, options.appEnCode, options.appPrefix);

    return routes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function convertRoutes(
  routes: BackMenu[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
  globSetting: any,
  token: string | undefined,
  appEnCode: string | undefined,
  appPrefix: string | undefined,
): RouteRecordRaw[] {
  for (const route of routes) {
    route.component = 'BasicLayout';
  }

  return mapTree(routes, (node: BackMenu) => {
    const name = getRouteName(node.enCode);
    const route: any = {
      name,
      meta: {
        icon: node.icon,
        title: node.fullName,
        i18nCode: `routes.${node.enCode.replaceAll('.', '-')}`,
        modelId: node.id,
        type: node.type,
      },
    };
    // 应用/目录
    if (node.type == 0 || node.type == 1) {
      route.path = `/${node.enCode.replaceAll('.', '/')}`;
      if (node.component) route.component = layoutMap[node.component];
      if (node.children?.length) route.children = node.children;
    }
    // 确保路径以 '/' 开头
    const urlAddress = node.urlAddress && node.urlAddress.startsWith('/') ? node.urlAddress : `/${node.urlAddress}`;
    let routePath = urlAddress;
    let query = {};
    if (urlAddress.includes('?')) {
      routePath = urlAddress.split('?')[0] as string;
      try {
        if (urlAddress.split('?')[1]) {
          query = qs.parse(urlAddress.split('?')[1] as string);
        }
      } catch {}
    }
    // 2-页面、11-回传表单
    if ([2, 11].includes(node.type)) {
      route.path = routePath;
      route.meta.query = query;
      route.component = dynamicImport(node.pageAddress ?? node.urlAddress, layoutMap, pageMap);
    }
    // 3-表单、4-字典、5-报表(原)、8-门户、9-流程、10-报表
    if ([3, 4, 5, 8, 9, 10].includes(node.type)) {
      let component = '';
      let isTree = 0;
      const propertyJson = node.propertyJson ? JSON.parse(node.propertyJson) : null;
      let relationId: string = '';
      if (propertyJson) {
        relationId = propertyJson.moduleId || '';
        isTree = propertyJson.isTree || 0;
      }
      if (node.type == 3 || node.type == 9) {
        component = 'OnlineModel';
      } else if (node.type == 4) {
        component = 'OnlineDict';
      } else if (node.type == 5) {
        component = 'OnlineDataReport';
      } else if (node.type == 10) {
        component = 'OnlineReport';
      } else {
        component = 'OnlinePortal';
      }
      route.path = routePath;
      route.meta.query = query;
      route.name = component + name;
      route.component = createCustomComponent(route.name, defineAsyncComponent(layoutMap[`${component}View`] as any));
      route.meta.relationId = relationId;
      route.meta.isTree = isTree;
    }
    // 大屏
    if (node.type == 6) {
      let moduleId = '';
      const propertyJson = node.propertyJson ? JSON.parse(node.propertyJson) : null;
      if (propertyJson) moduleId = propertyJson.moduleId || '';
      route.meta.link = `${globSetting.dataVUrl || ''}${appEnCode ? `${appPrefix}${appEnCode}/` : ''}view/${moduleId}?token=${token || ''}`;
      route.path = `/${node.enCode.replaceAll('.', '/')}`;
      route.component = layoutMap.IFrameView;
    }
    // 外链
    if (node.type == 7) {
      route.path = routePath;
      route.meta.query = query;
      route.component = layoutMap.IFrameView;
      const path = node.pageAddress
        .replaceAll('${dataV}', (globSetting.dataVUrl || '') + (appEnCode ? `${appPrefix}${appEnCode}/` : ''))
        .replaceAll('${jnpfToken}', token || '')
        .replaceAll('${jnpfAppCode}', appEnCode || '');
      if (node.linkTarget === '_self') {
        route.meta.iframeSrc = path;
      } else {
        route.meta.link = path;
        route.path = path;
      }
    }

    return route;
  });
}

function dynamicImport(path: string, layoutMap: ComponentRecordType, pageMap: ComponentRecordType) {
  const normalizePath = normalizeViewPath(path);
  let component = pageMap[normalizePath.endsWith('.vue') ? normalizePath : `${normalizePath}.vue`];
  if (!component) {
    component = pageMap[`${normalizePath}/index.vue`];
  }
  if (!component) {
    component = layoutMap.NotFoundView;
  }
  return component;
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

  // 这里耦合了jnpf-admin的目录结构
  return viewPath.replace(/^\/views/, '');
}

/**
 * 将指定组件设置自定义名称
 *
 * @param {string} customName 组件自定义名称
 * @param {AsyncComponent} asyncComponent
 * @return {Component}
 */
function createCustomComponent(customName: string, asyncComponent: any) {
  return defineComponent({
    name: customName,
    setup() {
      return () => h(asyncComponent);
    },
  });
}

// 获取路由名称
function getRouteName(name) {
  const routeName = name
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  return routeName;
}

export { generateRoutesByBackend };
