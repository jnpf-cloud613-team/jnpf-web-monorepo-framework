import type { Component } from 'vue';

import type { ComponentType } from './types/index';

/**
 * Component list, register here to setting it in the form
 */
// jnpf 组件
import {
  JnpfAlert,
  JnpfBarcode,
  JnpfButton,
  JnpfCascader,
  JnpfCheckbox,
  JnpfCheckboxSingle,
  JnpfColorPicker,
  JnpfCron,
  JnpfDatePicker,
  JnpfDateRange,
  JnpfDivider,
  JnpfEditor,
  BasicCaption as JnpfGroupTitle,
  JnpfIconPicker,
  JnpfIframe,
  JnpfInput,
  JnpfInputNumber,
  JnpfLink,
  JnpfMarkdown,
  JnpfMarkdownViewer,
  JnpfNumberRange,
  JnpfQrcode,
  JnpfRadio,
  JnpfRate,
  JnpfSelect,
  JnpfSlider,
  JnpfSwitch,
  JnpfText,
  JnpfTextarea,
  JnpfTimePicker,
  JnpfTimeRange,
  JnpfTreeSelect,
} from '@jnpf/ui';

import { Input } from 'ant-design-vue';

const componentMap = new Map<ComponentType, Component>();

componentMap.set('Alert', JnpfAlert);
componentMap.set('Button', JnpfButton);
componentMap.set('Cron', JnpfCron);
componentMap.set('Cascader', JnpfCascader);
componentMap.set('ColorPicker', JnpfColorPicker);
componentMap.set('Checkbox', JnpfCheckbox);
componentMap.set('JnpfCheckboxSingle', JnpfCheckboxSingle);
componentMap.set('DatePicker', JnpfDatePicker);
componentMap.set('DateRange', JnpfDateRange);
componentMap.set('TimePicker', JnpfTimePicker);
componentMap.set('TimeRange', JnpfTimeRange);
componentMap.set('Divider', JnpfDivider);
componentMap.set('Editor', JnpfEditor);
componentMap.set('GroupTitle', JnpfGroupTitle);
componentMap.set('Input', JnpfInput);
componentMap.set('InputPassword', Input.Password);
componentMap.set('InputSearch', Input.Search);
componentMap.set('Textarea', JnpfTextarea);
componentMap.set('InputNumber', JnpfInputNumber);
componentMap.set('IconPicker', JnpfIconPicker);
componentMap.set('Link', JnpfLink);
componentMap.set('Qrcode', JnpfQrcode);
componentMap.set('Barcode', JnpfBarcode);
componentMap.set('Radio', JnpfRadio);
componentMap.set('Rate', JnpfRate);
componentMap.set('Select', JnpfSelect);
componentMap.set('Slider', JnpfSlider);
componentMap.set('Switch', JnpfSwitch);
componentMap.set('Text', JnpfText);
componentMap.set('TreeSelect', JnpfTreeSelect);
componentMap.set('BillRule', JnpfInput);
componentMap.set('Markdown', JnpfMarkdown);
componentMap.set('MarkdownViewer', JnpfMarkdownViewer);
componentMap.set('ModifyUser', JnpfInput);
componentMap.set('ModifyTime', JnpfInput);
componentMap.set('NumberRange', JnpfNumberRange);
componentMap.set('Iframe', JnpfIframe);

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component);
}

export function del(compName: ComponentType) {
  componentMap.delete(compName);
}

export { componentMap };
