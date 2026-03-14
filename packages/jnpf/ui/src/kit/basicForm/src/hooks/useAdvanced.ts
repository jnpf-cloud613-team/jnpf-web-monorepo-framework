import type { ComputedRef, Ref } from 'vue';

import type { ColEx } from '../types';
import type { FormProps, FormSchema } from '../types/form';
import type { AdvanceState } from '../types/hooks';

import { computed, getCurrentInstance, shallowReactive, unref, watch } from 'vue';

import { useBreakpoint } from '@jnpf/hooks';
import { isBoolean, isFunction, isNumber, isObject } from '@jnpf/utils';

import { useDebounceFn } from '@vueuse/core';

const BASIC_COL_LEN = 24;

interface UseAdvancedContext {
  advanceState: AdvanceState;
  defaultValueRef: Ref<Recordable>;
  emit: any;
  formModel: Recordable;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
}

export default function useAdvanced({ advanceState, defaultValueRef, emit, formModel, getProps, getSchema }: UseAdvancedContext) {
  const vm = getCurrentInstance();

  const fieldsIsAdvancedMap = shallowReactive({});

  const { realWidthRef, screenEnum, screenRef } = useBreakpoint();

  const getEmptySpan = computed((): number => {
    if (!advanceState.isAdvanced) {
      return 0;
    }
    // For some special cases, you need to manually specify additional blank lines
    const emptySpan = unref(getProps).emptySpan || 0;

    if (isNumber(emptySpan)) {
      return emptySpan;
    }
    if (isObject(emptySpan)) {
      const { span = 0 } = emptySpan;
      const screen = unref(screenRef) as string;

      const screenSpan = (emptySpan as any)[screen.toLowerCase()];
      return screenSpan || span || 0;
    }
    return 0;
  });

  const debounceUpdateAdvanced = useDebounceFn(updateAdvanced, 0);

  watch(
    [() => unref(getSchema), () => advanceState.isAdvanced, () => unref(realWidthRef)],
    () => {
      const { showAdvancedButton } = unref(getProps);
      if (showAdvancedButton) {
        debounceUpdateAdvanced();
      }
    },
    { immediate: true },
  );

  function getAdvanced(itemCol: Partial<ColEx>, itemColSum = 0, isLastAction = false) {
    const width = unref(realWidthRef);

    const mdWidth =
      Number.parseInt(itemCol.md as string) ||
      Number.parseInt(itemCol.xs as string) ||
      Number.parseInt(itemCol.sm as string) ||
      (itemCol.span as number) ||
      BASIC_COL_LEN;

    const lgWidth = Number.parseInt(itemCol.lg as string) || mdWidth;
    const xlWidth = Number.parseInt(itemCol.xl as string) || lgWidth;
    const xxlWidth = Number.parseInt(itemCol.xxl as string) || xlWidth;
    if (width <= screenEnum.LG) {
      itemColSum += mdWidth;
    } else if (width < screenEnum.XL) {
      itemColSum += lgWidth;
    } else if (width < screenEnum.XXL) {
      itemColSum += xlWidth;
    } else {
      itemColSum += xxlWidth;
    }

    if (isLastAction) {
      advanceState.hideAdvanceBtn = false;
      if (itemColSum <= BASIC_COL_LEN * 2 - 6) {
        // When less than or equal to 2 lines, the collapse and expand buttons are not displayed
        advanceState.hideAdvanceBtn = true;
        // 表单组件默认展开问题修复
        // advanceState.isAdvanced = true;
      } else if (itemColSum > BASIC_COL_LEN * 2 - 6 && itemColSum <= BASIC_COL_LEN * (unref(getProps).autoAdvancedLine || 30)) {
        advanceState.hideAdvanceBtn = false;

        // More than 3 lines collapsed by default
      } else if (!advanceState.isLoad) {
        advanceState.isLoad = true;
        advanceState.isAdvanced = !advanceState.isAdvanced;
      }
      return { isAdvanced: advanceState.isAdvanced, itemColSum };
    }

    return itemColSum > BASIC_COL_LEN * (unref(getProps).alwaysShowLines || 1) - 6
      ? { isAdvanced: advanceState.isAdvanced, itemColSum }
      : { isAdvanced: true, itemColSum };
  }

  function updateAdvanced() {
    let itemColSum = 0;
    let realItemColSum = 0;
    const { baseColProps = {} } = unref(getProps);

    for (const schema of unref(getSchema)) {
      const { colProps, show } = schema;
      let isShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }

      if (isFunction(show)) {
        isShow = show({
          field: schema.field,
          model: formModel,
          schema,
          values: {
            ...unref(defaultValueRef),
            ...formModel,
          },
        });
      }

      if (isShow && (colProps || baseColProps)) {
        const { isAdvanced, itemColSum: sum } = getAdvanced({ ...baseColProps, ...colProps }, itemColSum);

        itemColSum = sum || 0;
        if (isAdvanced) {
          realItemColSum = itemColSum;
        }
        fieldsIsAdvancedMap[schema.field] = isAdvanced;
      }
    }

    // 确保页面发送更新(第一次不需要更新、第一次更新会报错)
    try {
      vm?.proxy?.$forceUpdate();
    } catch {}

    advanceState.actionSpan = (realItemColSum % BASIC_COL_LEN) + unref(getEmptySpan);

    getAdvanced(unref(getProps).actionColOptions || { span: BASIC_COL_LEN }, itemColSum, true);

    emit('advancedChange');
  }

  function handleToggleAdvanced() {
    advanceState.isAdvanced = !advanceState.isAdvanced;
  }

  return { fieldsIsAdvancedMap, handleToggleAdvanced };
}
