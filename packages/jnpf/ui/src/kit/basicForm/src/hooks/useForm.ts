import type { DynamicProps } from '@jnpf/utils';
import type { NamePath } from 'ant-design-vue/lib/form/interface';

import type { FormActionType, FormProps, FormSchema, UseFormReturnType } from '../types/form';

import { nextTick, onUnmounted, ref, unref, watch } from 'vue';

import { getDynamicProps } from '@jnpf/utils';

import { useAppConfig } from '@vben/hooks';

export declare type ValidateFields = (nameList?: NamePath[]) => Promise<Recordable>;

type Props = Partial<DynamicProps<FormProps>>;

const { isProdMode } = useAppConfig(import.meta.env, import.meta.env.PROD);

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      throw new Error('The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!');
    }
    await nextTick();
    return form as FormActionType;
  }

  function register(instance: FormActionType) {
    isProdMode() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;

    formRef.value = instance;
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        deep: true,
        immediate: true,
      },
    );
  }

  const methods: FormActionType = {
    appendSchemaByField: async (schema: FormSchema | FormSchema[], prefixField: string | undefined, first?: boolean) => {
      const form = await getForm();
      form.appendSchemaByField(schema, prefixField, first);
    },
    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      form.clearValidate(name);
    },

    // TODO promisify
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },

    removeSchemaByField: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByField(field);
    },

    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.resetSchema(data);
    },

    scrollToField: async (name: NamePath, options?: ScrollOptions | undefined) => {
      const form = await getForm();
      form.scrollToField(name, options);
    },

    setFieldsValue: async <T extends Recordable<any>>(values: T) => {
      const form = await getForm();
      form.setFieldsValue<T>(values);
    },

    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      form.setProps(formProps);
    },

    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.updateSchema(data);
    },

    validate: async (nameList?: NamePath[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validate(nameList);
    },

    validateFields: async (nameList?: NamePath[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validateFields(nameList);
    },
  };

  return [register, methods];
}
