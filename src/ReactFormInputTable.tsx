import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  InputNumber,
  Button,
  Popconfirm,
  Form,
  DatePicker,
  message,
  Space,
  Select,
  Switch,
  Empty,
} from "antd";
import moment from "moment";
import s from "./index.css";
import {
  ReactFormInputTableProps,
  EditableCellProps,
  selectSourceProps,
} from "./ReactFormInputTable.d";

import { transformMomentToNumber } from "./utils";

const { Option } = Select;

const TEMPORARY_ID_PREFIX = "temp_"; // 新增数据时 id前面增加标示

const EditableContext = React.createContext<any>(null);

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  index,
  inputType,
  max,
  min,
  rows,
  format,
  timeDefaultValue,
  maxLength,
  disabled,
  rules,
  editable,
  children,
  dataIndex,
  record,
  selectMode,
  isSingleSave,
  onDelete,
  onSingleSave,
  customRender,
  selectSource,
  ...restProps
}) => {
  // const form = useContext(EditableContext);
  if (!record) {
    return null;
  }

  const cellDelete = () => {
    onDelete(record.id);
  };

  const cellSave = () => {
    onSingleSave(record.id);
  };

  const getRules = () => {
    let defaultRule: any[] = [
      {
        required: true,
        message: `请输入${title}`,
      },
    ];
    if (max) {
      // number 或 string 才会有最大值或最大字符串长度
      const type = inputType === "number" ? "number" : "string";
      const message =
        inputType === "number"
          ? `${title}最大不能超过${max}`
          : `${title}最多${max}个字符`;
      defaultRule = [...defaultRule, { max, type, message }];
    }
    if (min) {
      const type = inputType === "number" ? "number" : "string";
      const message =
        inputType === "number"
          ? `${title}最小不能小于${min}`
          : `${title}最少${min}个字符`;
      defaultRule = [...defaultRule, { max, type, message }];
    }
    return rules ?? defaultRule;
  };

  const inputNode = () => {
    if (dataIndex === "serialNumber") {
      return index + 1;
    }
    switch (inputType) {
      // 日期格式
      case "dateTimePicker":
        return (
          <Form.Item
            name={[record.id, dataIndex]}
            initialValue={moment(record[dataIndex])}
            rules={getRules()}
          >
            <DatePicker
              format={format ?? "YYYY-MM-DD HH:mm:ss"}
              showTime={{
                defaultValue:
                  timeDefaultValue ?? moment("00:00:00", "HH:mm:ss"),
              }}
            />
          </Form.Item>
        );

      // 删除操作
      case "operation":
        return isSingleSave ? (
          <Space>
            <a type="link" onClick={cellSave}>
              保存
            </a>
            <Popconfirm title="确定删除?" onConfirm={cellDelete}>
              <a type="link">删除</a>
            </Popconfirm>
          </Space>
        ) : (
          <a type="link" onClick={cellDelete}>
            删除
          </a>
        );
      // 自定义操作
      case "select":
        return (
          <Form.Item
            name={[record.id, dataIndex]}
            initialValue={record[dataIndex]}
            rules={getRules()}
          >
            <Select mode={selectMode} showArrow>
              {selectSource.map((source: selectSourceProps) => (
                <Option value={source.id} key={source.id}>
                  {source.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case "number":
        return (
          <Form.Item
            name={[record.id, dataIndex]}
            initialValue={record[dataIndex]}
            rules={getRules()}
          >
            <InputNumber />
          </Form.Item>
        );

      case "boolean":
        return (
          <Form.Item
            name={[record.id, dataIndex]}
            initialValue={record[dataIndex]}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );
      // 自定义操作
      case "customAction":
        if (dataIndex) {
          return (
            <Form.Item
              name={[record.id, dataIndex]}
              initialValue={record[dataIndex]}
            >
              {customRender(record, index)}
            </Form.Item>
          );
        }
        return customRender(record, index);

      // 默认是输入框
      default:
        return (
          <Form.Item
            name={[record.id, dataIndex]}
            initialValue={record[dataIndex]}
            rules={getRules()}
          >
            {rows ? (
              <Input.TextArea
                rows={rows}
                disabled={disabled}
                title={record[dataIndex]}
              />
            ) : (
              <Input disabled={disabled} title={record[dataIndex]} />
            )}
          </Form.Item>
        );
    }
  };
  return <td {...restProps}>{inputNode()}</td>;
};

const ReactFormInputTable: React.FC<ReactFormInputTableProps> = (
  {
    saveBtnText,
    addBtnText,
    isSingleSave,
    hiddenAddButton,
    columns,
    dataSource,
    notSerial,
    onSave,
    onDelete,
    limitDataSourceLen,
    loading,
    onlyAddCanEdit,
    beforeAdd,
    onSaveWithKey, // 保存回调数据中需额外增加的字段
    ...restProps
  },
  ref
) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSource);

  useEffect(() => {
    // 初始化数据处理
    if (Array.isArray(columns)) {
      if (!notSerial && columns[0].title !== "序号") {
        columns.unshift({ title: "序号", dataIndex: "serialNumber" });
      }
    } else {
      message.error("column需是数组");
    }
  }, []);

  useEffect(() => {
    if (dataSource && Array.isArray(dataSource)) {
      if (dataSource.length && !dataSource[0].id) {
        dataSource.forEach((item, index) => {
          item.id = index;
        });
        console.log(
          "!!ReactFormInputTable组件dataSource数据中需有id！！默认使用index作为id"
        );
      }
      setData([...dataSource]);
    }
  }, [dataSource]);

  const handleDelete = (id) => {
    if (isSingleSave && id && !id.toString().startsWith(TEMPORARY_ID_PREFIX)) {
      // 非单行保存 且不是临时id的才抛出删除id
      onDelete(id);
    } else {
      data.splice(
        data.findIndex((item) => item.id == id),
        1
      );
      setData([...data]);
    }
  };

  React.useImperativeHandle(ref, () => ({
    getForm: () => {
      return form;
    },
    innerHandleDelete: handleDelete,
  }));

  const handleAdd = () => {
    if (beforeAdd) {
      const isGoOn = beforeAdd();
      if (!isGoOn) {
        return;
      }
    }
    // if (limitDataSourceLen && data.length >= limitDataSourceLen) {
    //   message.error(`数据不能超过${limitDataSourceLen}个！`);
    //   return;
    // }
    // 新建数据 加上默认key 格式：TEMP_N_(R) 第几条数据_随机数，不然删除后id会重复
    const id = `${TEMPORARY_ID_PREFIX}_${data.length + 1}_${parseInt(
      String(Math.random() * 100)
    )}`;
    const newDataSource = [...data, { id }];
    setData([...newDataSource]);
  };

  // 在保存数据中增加指定传递的字段 - onSaveWithKey
  const appendItemWithKey = (item: any, key: string, value: number) => {
    const findItem = dataSource?.find((d: any) => d[key] === value);
    item[onSaveWithKey] = findItem ? findItem[onSaveWithKey] : "";
  };

  const handleSave = async (e) => {
    try {
      const values = await form.validateFields();
      const result = [];
      Object.keys(values).forEach((id) => {
        const item = transformMomentToNumber(values[id]);
        if (onSaveWithKey) {
          appendItemWithKey(item, "id", +id);
        }
        result.push(item);
      });
      console.log("保存数据成功：", result);
      onSave([...result]);
    } catch (err) {
      console.log("保存出错!", err);
    }
  };
  const handleSingleSave = async (id, index) => {
    try {
      const values = await form.validateFields();
      const result = transformMomentToNumber(values[id]);
      console.log("单行保存数据成功：", result);

      const saveParams: any = { ...result };
      id &&
        !id.toString().startsWith(TEMPORARY_ID_PREFIX) &&
        (saveParams.id = id); // 区分是否有真实的id
      onSave(saveParams, index);
      // id.toString().startsWith(TEMPORARY_ID_PREFIX) ? onSave({ ...result }) : onSave({ ...result, id });
    } catch (err) {
      console.log("保存出错!", err);
    }
  };
  const mergedColumns = columns.map((col: EditableCellProps) => {
    console.log(col, dataSource?.length);
    return {
      ...col,
      onCell: (record, index) => {
        return {
          ...col,
          index,
          record,
          isSingleSave,
          title: col.title,
          onDelete: (id) => {
            handleDelete(id);
          },
          disabled: col?.onlyAddCanEdit && index < dataSource?.length,
          onSingleSave: (id) => {
            handleSingleSave(id, index);
          },
        };
      },
    };
  });

  return (
    <div className={s.table}>
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            loading={loading}
            bordered
            columns={mergedColumns}
            dataSource={data || []}
            pagination={false}
            locale={{
              emptyText: "暂无数据",
            }}
          />
          {data.length ? null : (
            <Empty description="暂无数据" style={{ marginTop: 10 }} />
          )}
          <br />
          {!hiddenAddButton && (
            <Button
              onClick={handleAdd}
              type="primary"
              disabled={
                limitDataSourceLen && data.length === limitDataSourceLen
              }
            >
              {addBtnText || "+ 添加"}
            </Button>
          )}
          {isSingleSave ? null : (
            <Button
              onClick={handleSave}
              type="primary"
              style={{ marginLeft: 10 }}
            >
              {saveBtnText || "保存"}
            </Button>
          )}
        </EditableContext.Provider>
      </Form>
    </div>
  );
};

export default ReactFormInputTable;
