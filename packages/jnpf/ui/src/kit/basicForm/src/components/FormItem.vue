<script lang="tsx">
import type { Rule } from 'ant-design-vue/es/Form';

import type { PropType, Ref } from 'vue';

import type { FormActionType, FormProps, FormSchema } from '../types/form';

import { computed, defineComponent, toRefs, unref } from 'vue';

import { usePermission } from '@jnpf/hooks';
import { BasicHelp, JnpfDivider } from '@jnpf/ui';
import { getSlot, isArray, isBoolean, isFunction, isNull } from '@jnpf/utils';

import { $t } from '@vben/locales';

import { useDebounceFn } from '@vueuse/core';
import { Col, Form } from 'ant-design-vue';
import { cloneDeep, upperFirst } from 'lodash-es';

import { componentMap } from '../componentMap';
import { createPlaceholderMessage, noFieldComponents, numberItemType, setComponentRuleType, useInputComponents } from '../helper';
import { useItemLabelWidth } from '../hooks/useLabelWidth';

export default defineComponent({
  inheritAttrs: false,
  name: 'BasicFormItem',
  props: {
    allDefaultValues: {
      default: () => ({}),
      type: Object as PropType<Recordable>,
    },
    formActionType: {
      type: Object as PropType<FormActionType>,
    },
    formModel: {
      default: () => ({}),
      type: Object as PropType<Recordable>,
    },
    formProps: {
      default: () => ({}),
      type: Object as PropType<FormProps>,
    },
    isAdvanced: {
      type: Boolean,
    },
    schema: {
      default: () => ({}),
      type: Object as PropType<FormSchema>,
    },
    setFormModel: {
      default: null,
      type: Function as PropType<(key: string, value: any, schema: FormSchema) => void>,
    },
    tableAction: {
      type: Object as PropType<any>,
    },
  },
  setup(props, { slots }) {
    const { hasFormP } = usePermission();

    const { formProps, schema } = toRefs(props) as {
      formProps: Ref<FormProps>;
      schema: Ref<FormSchema>;
    };

    const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

    const getValues = computed(() => {
      const { allDefaultValues, formModel, schema } = props;
      const { mergeDynamicData } = props.formProps;
      return {
        field: schema.field,
        model: formModel,
        schema,
        values: {
          ...mergeDynamicData,
          ...allDefaultValues,
          ...formModel,
        } as Recordable,
      };
    });

    const getComponentsProps = computed(() => {
      const { formActionType, formModel, schema, tableAction } = props;
      let { componentProps = {} } = schema;
      if (isFunction(componentProps)) {
        componentProps = componentProps({ formActionType, formModel, schema, tableAction }) ?? {};
      }
      return componentProps as Recordable;
    });

    const getDisable = computed(() => {
      const { disabled: globDisabled } = props.formProps;
      const { dynamicDisabled } = props.schema;
      const { disabled: itemDisabled = false } = unref(getComponentsProps);
      let disabled = !!globDisabled || itemDisabled;
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled;
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues));
      }
      return disabled;
    });

    function getShow(): { isIfShow: boolean; isShow: boolean } {
      const { auth = '', ifShow, show } = props.schema;
      const { showAdvancedButton } = props.formProps;
      const itemIsAdvanced = showAdvancedButton ? (isBoolean(props.isAdvanced) ? props.isAdvanced : true) : true;

      let isShow = true;
      let isIfShow = true;

      if (isBoolean(show)) {
        isShow = show;
      }
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues));
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues));
      }
      isShow = isShow && itemIsAdvanced;
      if (auth) isIfShow = hasFormP(auth) ? isIfShow : hasFormP(auth);
      return { isIfShow, isShow };
    }

    function handleRules(): Rule[] {
      const { component, dynamicRules, label, required, rules: defRules = [], rulesMessageJoinLabel } = props.schema;

      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues)) as Rule[];
      }

      let rules: Rule[] = cloneDeep(defRules) as Rule[];
      const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;

      const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel') ? rulesMessageJoinLabel : globalRulesMessageJoinLabel;
      const defaultMsg = `${createPlaceholderMessage(component)}${joinLabel ? label : ''}`;

      function validator(rule: any, value: any) {
        const msg = rule.message || defaultMsg;
        if (value === undefined || isNull(value)) {
          // 空值
          return Promise.reject(msg);
        } else if (Array.isArray(value) && value.length === 0) {
          // 数组类型
          return Promise.reject(msg);
        } else if (typeof value === 'string' && value.trim() === '') {
          // 空字符串
          return Promise.reject(msg);
        } else if (
          typeof value === 'object' &&
          Reflect.has(value, 'checked') &&
          Reflect.has(value, 'halfChecked') &&
          Array.isArray(value.checked) &&
          Array.isArray(value.halfChecked) &&
          value.checked.length === 0 &&
          value.halfChecked.length === 0
        ) {
          // 非关联选择的tree组件
          return Promise.reject(msg);
        }
        return Promise.resolve();
      }

      const getRequired = isFunction(required) ? required(unref(getValues)) : required;

      /*
       * 1、若设置了required属性，又没有其他的rules，就创建一个验证规则；
       * 2、若设置了required属性，又存在其他的rules，则只rules中不存在required属性时，才添加验证required的规则
       *     也就是说rules中的required，优先级大于required
       */
      if (getRequired) {
        if (!rules || rules.length === 0) {
          rules = [{ required: getRequired, validator }];
        } else {
          const requiredIndex: number = rules.findIndex((rule) => Reflect.has(rule, 'required'));

          if (requiredIndex === -1) {
            rules.push({ required: getRequired, validator });
          }
        }
      }

      const requiredRuleIndex: number = rules.findIndex((rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'));

      if (requiredRuleIndex !== -1) {
        const rule: any = rules[requiredRuleIndex];
        const { isShow } = getShow();
        if (!isShow) {
          rule.required = false;
        }
        if (component) {
          if (!Reflect.has(rule, 'type')) {
            rule.type = component === 'InputNumber' ? 'number' : 'string';
          }

          rule.message = rule.message || defaultMsg;

          if (component.includes('Input') || component.includes('Textarea')) {
            rule.whitespace = true;
          }
          const valueFormat = unref(getComponentsProps)?.valueFormat;
          setComponentRuleType(rule, component, valueFormat);
        }
      }

      // Maximum input length rule check
      const characterInx = rules.findIndex((val) => val.max);
      const rule: any = rules[characterInx];
      if (characterInx !== -1 && !rule.validator) {
        rule.message = rule.message || $t('component.form.maxTip', [rule.max] as Recordable);
      }
      return rules;
    }

    function renderComponent() {
      const { changeEvent = 'change', component, field, renderComponentContent, valueField } = props.schema;

      if (useInputComponents.includes(component)) {
        const Comp = componentMap.get(component) as ReturnType<typeof defineComponent>;
        return <Comp placeholder="系统自动生成" readonly={true} />;
      }

      const eventKey = `on${upperFirst(changeEvent)}`;

      const { autoSetPlaceHolder, size } = props.formProps;
      const propsData: Recordable = {
        allowClear: true,
        // getPopupContainer: (trigger: Element) => trigger.parentNode,
        size,
        ...unref(getComponentsProps),
        disabled: unref(getDisable),
      };

      const on = {
        [eventKey]: (...args: Nullable<Recordable>[]) => {
          const [e] = args;
          if (propsData[eventKey]) {
            propsData[eventKey](...args);
          }
          const target = e ? e.target : null;
          const value = target ? target.value : e;
          props.setFormModel(field, value, props.schema);
        },
      };
      const Comp = componentMap.get(component) as ReturnType<typeof defineComponent>;

      const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
      // RangePicker place is an array
      if (isCreatePlaceholder && component !== 'DateRange' && component !== 'TimeRange' && component) {
        propsData.placeholder = unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component);
      }
      propsData.codeField = field;
      propsData.formValues = unref(getValues);
      const getComponentValue = (value) => {
        return numberItemType.includes(component) ? (value ?? 0) : value;
      };

      const bindValue: Recordable = {
        [valueField || 'value']: getComponentValue(props.formModel[field]),
      };
      // 列表搜索时部分输入框按回车触发搜索事件
      const onPressEnter = () => {
        props.formActionType?.submit();
      };
      const debouncePressEnter = useDebounceFn(onPressEnter, 200);
      const keyupObj = component === 'Input' && unref(getComponentsProps)?.submitOnPressEnter ? { onPressEnter: debouncePressEnter } : {};

      const compAttr: Recordable = {
        ...propsData,
        ...on,
        ...bindValue,
        ...keyupObj,
      };
      // 关闭输入框联想
      if (component === 'Input') compAttr.autoComplete = 'off';

      if (!renderComponentContent) {
        return <Comp {...compAttr} />;
      }
      const compSlot = isFunction(renderComponentContent)
        ? { ...renderComponentContent(unref(getValues)) }
        : {
            default: () => renderComponentContent,
          };
      return <Comp {...compAttr}>{compSlot}</Comp>;
    }

    function renderLabelHelpMessage() {
      const { component, helpComponentProps, helpMessage, label, subLabel } = props.schema;
      if (noFieldComponents.includes(component) && !['Barcode', 'Qrcode'].includes(component)) {
        return '';
      }
      const renderLabel = subLabel ? (
        <span>
          {label} <span class="text-secondary">{subLabel}</span>
        </span>
      ) : (
        label
      );
      const getHelpMessage = isFunction(helpMessage) ? helpMessage(unref(getValues)) : helpMessage;
      if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
        return renderLabel;
      }
      return (
        <span>
          {renderLabel}
          <BasicHelp placement="top" text={getHelpMessage} {...helpComponentProps} />
        </span>
      );
    }

    function renderItem() {
      const { className, component, extra, field, itemProps, render, slot, suffix } = props.schema;
      const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
      const { colon } = props.formProps;

      if (component === 'Divider') {
        return (
          <Col span={24}>
            <JnpfDivider {...unref(getComponentsProps)} />
          </Col>
        );
      } else {
        const getContent = () => {
          return slot ? getSlot(slots, slot, unref(getValues)) : render ? render(unref(getValues)) : renderComponent();
        };

        const showSuffix = !!suffix;
        const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix;
        const name = noFieldComponents.includes(component) ? '' : field;
        const itemClassName = isArray(className) ? [...className] : [className];

        return (
          <Form.Item
            class={[...itemClassName, { 'suffix-item': showSuffix }]}
            colon={colon}
            name={name}
            {...(itemProps as Recordable)}
            extra={extra}
            label={renderLabelHelpMessage()}
            labelCol={labelCol}
            rules={handleRules()}
            wrapperCol={wrapperCol}>
            <div style="display:flex">
              <div style="flex:1;">{getContent()}</div>
              {showSuffix && <span class="suffix">{getSuffix}</span>}
            </div>
          </Form.Item>
        );
      }
    }

    return () => {
      const { colProps = {}, colSlot, component, renderColContent } = props.schema;
      if (!componentMap.has(component)) {
        return null;
      }

      const { baseColProps = {} } = props.formProps;
      const realColProps = { ...baseColProps, ...colProps };
      const { isIfShow, isShow } = getShow();
      const values = unref(getValues);

      const getContent = () => {
        return colSlot ? getSlot(slots, colSlot, values) : renderColContent ? renderColContent(values) : renderItem();
      };

      return (
        isIfShow && (
          <Col {...realColProps} v-show={isShow}>
            {getContent()}
          </Col>
        )
      );
    };
  },
});
</script>
