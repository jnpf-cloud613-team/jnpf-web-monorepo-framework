import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';

import type { CSSProperties, PropType } from 'vue';

import type { ColEx } from './types';
import type { FieldMapToTime, FormSchema } from './types/form';

import { propTypes } from '@jnpf/utils';

export const basicProps = {
  // 操作列Col配置
  actionColOptions: Object as PropType<Partial<ColEx>>,
  // 不受折叠影响的行数
  alwaysShowLines: propTypes.number.def(1),
  // 超过3行自动折叠
  autoAdvancedLine: propTypes.number.def(30),
  // 是否聚焦第一个输入框，只在第一个表单项为input的时候作用
  autoFocusFirstItem: propTypes.bool,
  autoSetPlaceHolder: propTypes.bool.def(true),
  // 在INPUT组件上单击回车时，是否自动提交
  autoSubmitOnEnter: propTypes.bool.def(false),
  baseColProps: {
    default: () => ({ span: 24 }),
    type: Object as PropType<Partial<ColEx>>,
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  colon: propTypes.bool,
  compact: propTypes.bool,
  // 禁用表单
  disabled: propTypes.bool,
  emptySpan: {
    default: 0,
    type: [Number, Object] as PropType<number | Recordable>,
  },
  fieldMapToTime: {
    default: () => [],
    type: Array as PropType<FieldMapToTime>,
  },
  // 以下为默认props
  hideRequiredMark: propTypes.bool,
  labelAlign: propTypes.string,
  labelCol: Object as PropType<Partial<ColEx>>,
  // 标签宽度  固定宽度
  labelWidth: {
    default: 80,
    type: [Number, String] as PropType<number | string>,
  },
  layout: propTypes.oneOf(['horizontal', 'vertical', 'inline']).def('horizontal'),
  mergeDynamicData: {
    default: null,
    type: Object as PropType<Recordable>,
  },
  model: {
    default: () => ({}),
    type: Object as PropType<Recordable>,
  },

  // 重置按钮配置
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,
  // 自定义重置函数
  resetFunc: Function as PropType<() => Promise<void>>,
  rowProps: Object as PropType<RowProps>,
  rulesMessageJoinLabel: propTypes.bool.def(true),
  // 表单配置规则
  schemas: {
    default: () => [],
    type: Array as PropType<FormSchema[]>,
  },

  // 是否显示操作按钮
  showActionButtonGroup: propTypes.bool.def(false),
  // 是否显示收起展开按钮
  showAdvancedButton: propTypes.bool,

  // 显示重置按钮
  showResetButton: propTypes.bool.def(true),
  // 显示确认按钮
  showSubmitButton: propTypes.bool.def(true),

  size: propTypes.oneOf(['default', 'small', 'large']).def('default'),

  // 确认按钮配置
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,

  submitFunc: Function as PropType<() => Promise<void>>,
  submitOnChange: propTypes.bool,

  submitOnReset: propTypes.bool,

  tableAction: {
    type: Object as PropType<any>,
  },

  // 转化时间
  transformDateFunc: {
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
    type: Function as PropType<Fn>,
  },

  wrapperCol: Object as PropType<Partial<ColEx>>,
};
