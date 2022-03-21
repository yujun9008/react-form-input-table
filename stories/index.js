// stories/index.js

import React from "react";
import { storiesOf } from "@storybook/react";
import { RangePicker, Button } from "antd";
import moment from "moment";
import "antd/dist/antd.css";
import AdminInputTable from "../src/AdminInputTable";
const COLUMNS = [
  {
    title: "名称",
    dataIndex: "title",
  },
  {
    title: "富文本",
    dataIndex: "richText",
    rows: "3",
  },
  {
    title: "日期",
    dataIndex: "time",
    inputType: "dateTimePicker",
  },
  {
    title: "开关",
    dataIndex: "switch",
    inputType: "boolean",
  },
  {
    title: "选择框",
    dataIndex: "select",
    inputType: "select",
    selectSource: [
      {
        id: 1,
        name: "第一项",
      },
      {
        id: 2,
        name: "第二项",
      },
    ],
  },
  {
    title: "自定义时间",
    dataIndex: "dateRange",
    inputType: "customAction",
    customRender: (record) => {
      return (
        <>
          <Button>自定义操作</Button>
        </>
      );
    },
  },
  {
    title: "操作",
    dataIndex: "operation",
    inputType: "operation",
  },
];
const dataSource = [
  {
    id: 1,
    title: "测试",
    time: moment(),
    switch: true,
    select: 2,
  },
];
const onSave = () => {};
const onDelete = () => {};

storiesOf("react-form-table", module)
  .add("默认", () => (
    <AdminInputTable
      columns={COLUMNS}
      dataSource={dataSource}
      onSave={onSave}
      onDelete={onDelete}
      addBtnText="新增一条数据"
    />
  ))
  .add("单行保存模式", () => (
    <AdminInputTable
      columns={COLUMNS}
      isSingleSave
      dataSource={[]}
      onSave={onSave}
      onDelete={onDelete}
      addBtnText="新增一条数据"
    />
  ));
