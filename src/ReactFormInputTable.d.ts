declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

export interface ReactFormInputTableProps {
  columns: EditableCellProps[]; // 行标题
  dataSource: dataSourceProps[]; // 数据
  saveBtnText?: string; // 保存按钮文案
  addBtnText?: string; // 新增按钮文案
  isSingleSave?: boolean; // 是否单行保存 每条数据都有保存按钮
  hiddenAddButton?: boolean; // 是否隐藏新增按钮 默认false
  limitDataSourceLen?: number; // 最大的数据条数限制 超出则添加按钮disabled状态
  notSerial?: boolean; // 不需要序号
  onSave: { (record: {}, index?: number): void };
  onDelete?: { (id): void }; // 用单行保存模式抛出删除事件
  loading?: any;
  onlyAddCanEdit?: boolean;
  beforeAdd?: { (): boolean };
  onSaveWithKey: string;
}

export interface EditableCellProps {
  index?: number;
  title: string;
  dataIndex: string;
  inputType?: string;
  render?: any;
  disabled?: boolean;
  width?: string | number;
  selectMode?: "multiple" | "tags"; // 多选
  rules?: []; // 自定义校验规则 传[] 则表示非必填项
  max?: number; // 最大数字或最长字符串
  min?: number; // 最小数字或最短字符串
  format?: string; // 时间格式 'YYYY-MM-DD HH:mm:ss'/'YYYY-MM-DD HH:00:00'（只精确到小时）
  timeDefaultValue?: any; // 默认时间 moment('00:00:00', 'HH:mm:ss')（默认0点）
  rows?: number; // 使用TextArea代替Input，row表示行数
  maxLength?: number;
  editable?: boolean;
  record?: {
    id: number | string;
  };
  selectSource?: [];
  isSingleSave?: boolean;
  customRender?: { (record, index): React.ReactElement }; // 自定义输出
  onDelete?: { (id): void };
  onSingleSave?: { (id): void };
  onlyAddCanEdit?: boolean;
}

export interface dataSourceProps {
  id?: number | string;
}

// export interface EditableCellProps {
//   index: number;
//   title: React.ReactNode;
//   editable: boolean;
//   children: React.ReactNode;
//   dataIndex: string;
//   record: {};
//   inputType: string;
//   onDelete: (index: number) => void;
//   rules: [] | undefined;
// }

export interface selectSourceProps {
  id: string | number;
  name: string;
}
