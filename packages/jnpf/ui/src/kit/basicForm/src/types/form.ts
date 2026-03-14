/* eslint-disable no-use-before-define */
import type { ButtonProps as AntdButtonProps } from '@jnpf/ui';
import type { NamePath, RuleObject } from 'ant-design-vue/lib/form/interface';
import type { RowProps } from 'ant-design-vue/lib/grid/Row';

import type { CSSProperties, VNode } from 'vue';

import type { FormItem } from './formItem';
import type { ColEx, ComponentType } from './index';

export type FieldMapToTime = [string, [string, string], ([string, string] | string)?][];

export type Rule = RuleObject & {
  trigger?: 'blur' | 'change' | ['change', 'blur'];
};

export interface ButtonProps extends AntdButtonProps {
  text?: string;
}

export interface FormActionType {
  appendSchemaByField: (schema: FormSchema | FormSchema[], prefixField: string | undefined, first?: boolean | undefined) => Promise<void>;
  clearValidate: (name?: string | string[]) => Promise<void>;
  getFieldsValue: () => Recordable;
  removeSchemaByField: (field: string | string[]) => Promise<void>;
  resetFields: () => Promise<void>;
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>;
  setFieldsValue: <T extends Recordable<any>>(values: T) => Promise<void>;
  setProps: (formProps: Partial<FormProps>) => Promise<void>;
  submit: () => Promise<void>;
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>;
  validate: (nameList?: NamePath[]) => Promise<any>;
  validateFields: (nameList?: NamePath[]) => Promise<any>;
}

export type RegisterFn = (formInstance: FormActionType) => void;

export type UseFormReturnType = [RegisterFn, FormActionType];

export interface HelpComponentProps {
  absolute: boolean;
  // colour
  color: string;
  // font size
  fontSize: string;
  icon: string;
  maxWidth: string;
  // Positioning
  position: any;
  // Whether to display the serial number
  showIndex: boolean;
  // Text list
  text: any;
}

export interface RenderCallbackParams {
  field: string;
  model: Recordable;

  schema: FormSchema;
  values: Recordable;
}

export interface FormSchema {
  // 权限编码控制是否显示
  auth?: string;
  // Event name triggered by internal value change, default change
  changeEvent?: string;
  className?: string | string[];
  // col configuration outside formModelItem
  colProps?: Partial<ColEx>;
  // Custom slot, similar to renderColContent
  colSlot?: string;
  // render component
  component: ComponentType;
  // Component parameters
  componentProps?: ((opt: { formActionType: FormActionType; formModel: Recordable; schema: FormSchema; tableAction: any }) => Recordable) | object;
  // 默认值
  defaultValue?: any;
  // Disable the adjustment of labelWidth with global settings of formModel, and manually set labelCol and wrapperCol by yourself
  disabledLabelWidth?: boolean;
  dynamicDisabled?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;
  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[];
  extra?: string;
  // Field name
  field: string;
  // BaseHelp component props
  helpComponentProps?: Partial<HelpComponentProps>;
  // Help text on the right side of the text
  helpMessage?: ((renderCallbackParams: RenderCallbackParams) => string | string[]) | string | string[];

  ifShow?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;

  isAdvanced?: boolean;
  // Reference formModelItem
  itemProps?: Partial<FormItem>;

  // Label name
  label: string | VNode;

  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: number | string;

  // Render the content in the form-item tag
  render?: (renderCallbackParams: RenderCallbackParams) => string | VNode | VNode[];
  // Rendering col content requires outer wrapper form-item
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => string | VNode | VNode[];

  renderComponentContent?: ((renderCallbackParams: RenderCallbackParams) => any) | string | VNode | VNode[];

  // Required
  required?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;

  // Validation rules
  rules?: Rule[];

  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;

  show?: ((renderCallbackParams: RenderCallbackParams) => boolean) | boolean;

  // Custom slot, in from-item
  slot?: string;

  // Matching details components
  span?: number;

  // Auxiliary text
  subLabel?: string;

  suffix?: ((values: RenderCallbackParams) => number | string) | number | string;

  // Variable name bound to v-model Default value
  valueField?: string;
}

export interface FormProps {
  // Operation column configuration
  actionColOptions?: Partial<ColEx>;
  // Always show lines
  alwaysShowLines?: number;
  // Automatically collapse over the specified number of rows
  autoAdvancedLine?: number;
  // Whether to focus on the first input box, only works when the first form item is input
  autoFocusFirstItem?: boolean;
  // Placeholder is set automatically
  autoSetPlaceHolder?: boolean;
  // Auto submit on press enter on input
  autoSubmitOnEnter?: boolean;
  // General col configuration
  baseColProps?: Partial<ColEx>;
  // General row style
  baseRowStyle?: CSSProperties;
  colon?: boolean;
  // Compact mode for search forms
  compact?: boolean;

  // Whether to disable
  disabled?: boolean;

  // Blank line span
  emptySpan?: number | Partial<ColEx>;

  // Time interval fields are mapped into multiple
  fieldMapToTime?: FieldMapToTime;
  // alignment
  labelAlign?: 'left' | 'right';
  // Col configuration for the entire form
  labelCol?: Partial<ColEx>;
  // The width of all items in the entire form
  labelWidth?: number | string;
  layout?: 'horizontal' | 'inline' | 'vertical';
  // Function values used to merge into dynamic control form items
  mergeDynamicData?: Recordable;
  // Form value
  model?: Recordable;
  name?: string;
  // Reset button configuration
  resetButtonOptions?: Partial<ButtonProps>;
  resetFunc?: () => Promise<void>;
  // Row configuration for the entire form
  rowProps?: RowProps;
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean;
  // Form configuration rules
  schemas?: FormSchema[];
  // Whether to show the operation button
  showActionButtonGroup?: boolean;
  // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean;

  // Show reset button
  showResetButton?: boolean;

  // Show confirmation button
  showSubmitButton?: boolean;

  // Internal component size of the form
  size?: 'default' | 'large' | 'small';

  // Confirm button configuration
  submitButtonOptions?: Partial<ButtonProps>;
  submitFunc?: () => Promise<void>;

  // Submit form on form changing
  submitOnChange?: boolean;
  // Submit form on reset
  submitOnReset?: boolean;
  transformDateFunc?: (date: any) => string;
  // Col configuration for the entire form
  wrapperCol?: Partial<ColEx>;
}
