<script lang="ts">
import type { Ref } from 'vue';

import type { FormActionType, FormProps, FormSchema } from './types/form';
import type { AdvanceState } from './types/hooks';

import { computed, defineComponent, nextTick, onMounted, reactive, ref, unref, watch } from 'vue';

import { useModalContext } from '@jnpf/ui/modal';
import { buildUUID, isArray, isFunction, merge } from '@jnpf/utils';

import { useDebounceFn } from '@vueuse/core';
import { Form, Row } from 'ant-design-vue';

import FormAction from './components/FormAction.vue';
import FormItem from './components/FormItem.vue';
import useAdvanced from './hooks/useAdvanced';
import { useAutoFocus } from './hooks/useAutoFocus';
import { createFormContext } from './hooks/useFormContext';
import { useFormEvents } from './hooks/useFormEvents';
import { useFormValues } from './hooks/useFormValues';
import { basicProps } from './props';

export default defineComponent({
  components: { Form, FormAction, FormItem, Row },
  emits: ['advancedChange', 'reset', 'submit', 'register', 'fieldValueChange'],
  name: 'BasicForm',
  props: basicProps,
  setup(props, { attrs, emit }) {
    const formModel = reactive<Recordable>({});
    const modalFn = useModalContext();

    const advanceState = reactive<AdvanceState>({
      actionSpan: 6,
      hideAdvanceBtn: false,
      // 默认是收起状态
      isAdvanced: false,
      isLoad: false,
    });

    const defaultValueRef = ref<Recordable>({});
    const fullValueRef = ref<Recordable>({});
    const isInitedDefaultRef = ref(false);
    const propsRef = ref<Partial<FormProps>>({});
    const schemaRef = ref<Nullable<FormSchema[]>>(null);
    const formElRef = ref<Nullable<FormActionType>>(null);

    const prefixCls = 'jnpf-basic-form';

    // 每个表单生成不同name保证id不重复
    const getFormName = computed((): string => {
      return `form-${buildUUID()}`;
    });
    // Get the basic configuration of the form
    const getProps = computed((): FormProps => {
      const newProps: any = unref(propsRef);
      return { ...props, ...newProps } as FormProps;
    });

    const getFormClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact,
        },
      ];
    });

    // Get uniform row style and Row configuration for the entire form
    const getRow = computed((): Recordable => {
      const { baseRowStyle = {}, rowProps } = unref(getProps);
      return {
        gutter: 16,
        style: baseRowStyle,
        ...rowProps,
      };
    });

    const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) }) as Recordable);

    const getSchema = computed((): FormSchema[] => {
      const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
      return unref(getProps).showAdvancedButton ? (schemas.filter((schema) => schema.component !== 'Divider') as FormSchema[]) : (schemas as FormSchema[]);
    });

    const { fieldsIsAdvancedMap, handleToggleAdvanced } = useAdvanced({
      advanceState,
      defaultValueRef,
      emit,
      formModel,
      getProps,
      getSchema,
    });

    const { handleFormValues, initDefault } = useFormValues({
      defaultValueRef,
      formModel,
      getProps,
      getSchema,
    });

    useAutoFocus({
      formElRef: formElRef as Ref<FormActionType>,
      getProps,
      getSchema,
      isInitedDefault: isInitedDefaultRef,
    });

    const {
      appendSchemaByField,
      clearValidate,
      getFieldsValue,
      handleSubmit,
      removeSchemaByField,
      resetFields,
      resetSchema,
      scrollToField,
      setFieldsValue,
      updateSchema,
      validate,
      validateFields,
    } = useFormEvents({
      defaultValueRef,
      emit,
      formElRef: formElRef as Ref<FormActionType>,
      formModel,
      fullValueRef,
      getProps,
      getSchema,
      handleFormValues,
      isInitedDefaultRef,
      schemaRef: schemaRef as Ref<FormSchema[]>,
    });

    createFormContext({
      resetAction: resetFields,
      submitAction: handleSubmit,
    });

    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps);
        if (!model) return;
        setFieldsValue(model);
      },
      {
        immediate: true,
      },
    );

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? []);
      },
    );

    watch(
      () => getSchema.value,
      (schema) => {
        nextTick(() => {
          //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
          modalFn?.redoModalHeight?.();
        });
        if (unref(isInitedDefaultRef)) {
          return;
        }
        if (schema?.length) {
          initDefault();
          isInitedDefaultRef.value = true;
        }
      },
    );

    watch(
      () => formModel,
      useDebounceFn(() => {
        unref(getProps).submitOnChange && handleSubmit();
      }, 300),
      { deep: true },
    );

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = merge(formProps as any, unref(propsRef) || {});
    }

    function setFormModel(key: string, value: any, schema: FormSchema) {
      formModel[key] = value;
      const { validateTrigger } = unref(getBindValue);
      if (isFunction(schema.dynamicRules) || isArray(schema.rules)) {
        return;
      }
      if (!validateTrigger || validateTrigger === 'change') {
        validateFields([key]).catch((_) => {});
      }
      emit('fieldValueChange', key, value);
    }

    function handleEnterPress(e: KeyboardEvent) {
      const { autoSubmitOnEnter } = unref(getProps);
      if (!autoSubmitOnEnter) return;
      if (e.key === 'Enter' && e.target && e.target instanceof HTMLElement) {
        const target: HTMLElement = e.target as HTMLElement;
        if (target && target.tagName && target.tagName.toUpperCase() == 'INPUT') {
          handleSubmit();
        }
      }
    }

    const formActionType: Partial<FormActionType> = {
      appendSchemaByField,
      clearValidate,
      getFieldsValue,
      removeSchemaByField,
      resetFields,
      resetSchema,
      scrollToField,
      setFieldsValue,
      setProps,
      submit: handleSubmit,
      updateSchema,
      validate,
      validateFields,
    };

    onMounted(() => {
      initDefault();
      emit('register', formActionType);
    });

    return {
      advanceState,
      defaultValueRef,
      fieldsIsAdvancedMap,
      formActionType: formActionType as any,
      formElRef,
      formModel,
      getBindValue,
      getFormActionBindProps: computed((): Recordable => ({ ...getProps.value, ...advanceState })),
      getFormClass,
      getProps,
      getRow,
      getSchema,
      handleEnterPress,
      handleToggleAdvanced,
      setFormModel,
      ...formActionType,
      getFormName,
    };
  },
});
</script>
<template>
  <Form v-bind="getBindValue" ref="formElRef" :class="getFormClass" :model="formModel" :name="getFormName" @keypress.enter="handleEnterPress">
    <Row v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
          :all-default-values="defaultValueRef"
          :form-action-type="formActionType"
          :form-model="formModel"
          :form-props="getProps"
          :is-advanced="fieldsIsAdvancedMap[schema.field]"
          :schema="schema"
          :set-form-model="setFormModel"
          :table-action="tableAction">
          <template v-for="item in Object.keys($slots)" #[item]="data">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem>
      </template>

      <FormAction v-bind="getFormActionBindProps" @toggle-advanced="handleToggleAdvanced">
        <template v-for="item in ['resetBefore', 'submitBefore', 'advanceBefore', 'advanceAfter']" #[item]="data">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </FormAction>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>
<style lang="scss">
.jnpf-basic-form {
  .ant-form-item {
    // &-label label::after {
    //   margin: 0 6px 0 2px;
    // }

    &-with-help {
      margin-bottom: 0;

      .ant-form-item-explain {
        min-height: 20px !important;
        font-size: 14px;
        line-height: 20px;
      }
    }

    &:not(.ant-form-item-with-help) {
      margin-bottom: 20px;
    }

    &.suffix-item {
      .ant-form-item-children {
        display: flex;
      }

      .ant-form-item-control {
        margin-top: 4px;
      }

      .suffix {
        display: inline-flex;
        align-items: center;
        padding-left: 6px;
        margin-top: 1px;
        line-height: 1;
      }
    }
  }

  .ant-form-item-explain {
    height: 0;
  }

  .ant-form-item-extra {
    min-height: 20px !important;
    font-size: 14px;
    line-height: 20px;
  }

  &--compact {
    .ant-form-item {
      margin-bottom: 10px !important;
    }
  }

  &.search-form {
    .ant-form-item {
      display: flex;

      .ant-form-item-row {
        display: flex;
        flex: 1;
      }

      .ant-form-item-label {
        width: auto !important;
      }
    }
  }
}
</style>
