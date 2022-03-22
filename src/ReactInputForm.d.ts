export interface ReactInputFormProps {
  columns: columnsProps[]; // 行标题
  dataSource: dataSourceProps[]; // 数据
  saveBtnText?: string; // 保存按钮文案
  addBtnText?: string; // 新增按钮文案
  isSingleSave?: boolean; // 是否单行保存 每条数据都有保存按钮
  hiddenAddButton?: boolean; // 是否隐藏新增按钮 默认false
  limitDataSourceLen?: number; // 最大的数据条数限制 超出则添加按钮disabled状态
  notSerial?: boolean; // 不需要序号
  onSave: (record) => void;
  onDelete?: (id) => void; // 用单行保存模式抛出删除事件
}

export interface columnsProps {
  title: string;
  dataIndex: string;
  inputType: string;
  render?: any;
  width?: string | number;
  selectMode?: "multiple" | "tags"; // 多选
  rules?: []; // 自定义校验规则 传[] 则表示非必填项
  max?: number; // 最大数字或最长字符串
  min?: number; // 最小数字或最短字符串
  customRender?: (record) => void; // 自定义输出
  format?: string; // 时间格式 'YYYY-MM-DD HH:mm:ss'/'YYYY-MM-DD HH:00:00'（只精确到小时）
  timeDefaultValue?: any; // 默认时间 moment('00:00:00', 'HH:mm:ss')（默认0点）
  rows?: number; // 使用TextArea代替Input，row表示行数
}

export interface dataSourceProps {}

export interface EditableCellProps {
  index: number;
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: string;
  record: {};
  inputType: string;
  onDelete: (index: number) => void;
  rules: [] | undefined;
}

export interface selectSourceProps {
  id: string | number;
  name: string;
}
