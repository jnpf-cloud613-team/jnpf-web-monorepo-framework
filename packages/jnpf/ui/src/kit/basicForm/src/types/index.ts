type ColSpanType = number | string;
export interface ColEx {
  /**
   * the layout fill of flex
   * @default none
   * @type ColSpanType
   */
  flex?: ColSpanType;
  /**
   * ≥992px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  lg?: ColSpanType | { offset: ColSpanType; span: ColSpanType };

  /**
   * ≥768px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  md?: ColSpanType | { offset: ColSpanType; span: ColSpanType };

  /**
   * the number of cells to offset Col from the left
   * @default 0
   * @type ColSpanType
   */
  offset?: ColSpanType;

  /**
   * raster order, used in flex layout mode
   * @default 0
   * @type ColSpanType
   */
  order?: ColSpanType;

  /**
   * the number of cells that raster is moved to the left
   * @default 0
   * @type ColSpanType
   */
  pull?: ColSpanType;

  /**
   * the number of cells that raster is moved to the right
   * @default 0
   * @type ColSpanType
   */
  push?: ColSpanType;

  /**
   * ≥576px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  sm?: ColSpanType | { offset: ColSpanType; span: ColSpanType };

  /**
   * raster number of cells to occupy, 0 corresponds to display: none
   * @default none (0)
   * @type ColSpanType
   */
  span?: ColSpanType;

  style?: any;

  /**
   * ≥1200px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xl?: ColSpanType | { offset: ColSpanType; span: ColSpanType };

  /**
   * <576px and also default setting, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xs?: ColSpanType | { offset: ColSpanType; span: ColSpanType };

  /**
   * ≥1600px, could be a span value or an object containing above props
   * @type { span: ColSpanType, offset: ColSpanType } | ColSpanType
   */
  xxl?: ColSpanType | { offset: ColSpanType; span: ColSpanType };
}

export type ComponentType =
  | 'Alert'
  | 'AreaSelect'
  | 'AutoComplete'
  | 'Barcode'
  | 'BillRule'
  | 'Button'
  | 'Calculate'
  | 'Cascader'
  | 'Checkbox'
  | 'ColorPicker'
  | 'CreateTime'
  | 'CreateUser'
  | 'Cron'
  | 'CurrOrganize'
  | 'CurrPosition'
  | 'DateCalculate'
  | 'DatePicker'
  | 'DateRange'
  | 'Divider'
  | 'Editor'
  | 'GroupSelect'
  | 'GroupTitle'
  | 'IconPicker'
  | 'Iframe'
  | 'Input'
  | 'InputCountDown'
  | 'InputGroup'
  | 'InputNumber'
  | 'InputPassword'
  | 'InputSearch'
  | 'InputTable'
  | 'JnpfCheckboxSingle'
  | 'Link'
  | 'Location'
  | 'Markdown'
  | 'MarkdownViewer'
  | 'ModifyTime'
  | 'ModifyUser'
  | 'MonthPicker'
  | 'NumberRange'
  | 'Ocr'
  | 'OrganizeSelect'
  | 'PopupAttr'
  | 'PopupSelect'
  | 'PopupTableSelect'
  | 'PosSelect'
  | 'Qrcode'
  | 'Radio'
  | 'Rate'
  | 'RelationForm'
  | 'RelationFormAttr'
  | 'RelationQuery'
  | 'Render'
  | 'RoleSelect'
  | 'Select'
  | 'Sign'
  | 'Signature'
  | 'Slider'
  | 'StrengthMeter'
  | 'Switch'
  | 'Text'
  | 'Textarea'
  | 'TimePicker'
  | 'TimeRange'
  | 'TreeSelect'
  | 'UploadFile'
  | 'UploadImg'
  | 'UploadImgSingle'
  | 'UserSelect'
  | 'UsersSelect'
  | 'WeekPicker';
