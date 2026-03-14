import type { ComputedRef } from 'vue';

import type { PaginationProps } from '../types/pagination';
import type { BasicTableProps } from '../types/table';

import { computed, ref, unref, watch } from 'vue';

import { isBoolean } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';

import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const';

interface ItemRender {
  originalElement: any;
  page: number;
  type: 'next' | 'page' | 'prev';
}

function itemRender({ originalElement, page, type }: ItemRender) {
  if (type === 'prev') {
    return page === 0 ? null : <LeftOutlined />;
  } else if (type === 'next') {
    return page === 1 ? null : <RightOutlined />;
  }
  return originalElement;
}

export function usePagination(refProps: ComputedRef<BasicTableProps>) {
  const configRef = ref<PaginationProps>({});
  const show = ref(true);

  watch(
    () => unref(refProps).pagination,
    (pagination) => {
      if (!isBoolean(pagination) && pagination) {
        configRef.value = {
          ...unref(configRef),
          ...pagination,
        };
      }
    },
  );

  const getPaginationInfo = computed((): any => {
    const { pagination } = unref(refProps);

    if (!unref(show) || (isBoolean(pagination) && !pagination)) {
      return false;
    }
    return {
      current: 1,
      defaultPageSize: PAGE_SIZE,
      itemRender,
      pageSize: PAGE_SIZE,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: (total) => $t('component.table.total', { total }),
      size: 'small',
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(configRef),
    };
  });

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo);
    configRef.value = {
      ...(isBoolean(paginationInfo) ? {} : paginationInfo),
      ...info,
    };
  }

  function getPagination() {
    return unref(getPaginationInfo);
  }

  function getShowPagination() {
    return unref(show);
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag;
  }

  return { getPagination, getPaginationInfo, getShowPagination, setPagination, setShowPagination };
}
