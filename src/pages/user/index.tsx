import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Form,
  Modal,
  Tag,
  Popconfirm,
  message,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getUserList, createUser, updateUser, deleteUser } from '@/api/user';
import type { UserItem, UserQueryParams } from '@/types/user';

export default function UserPage() {
  const [data, setData] = useState<UserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<UserQueryParams>({ page: 1, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();

  const fetchData = useCallback(async (params: UserQueryParams) => {
    setLoading(true);
    try {
      const res = await getUserList(params);
      setData(res.list);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(query);
  }, [query, fetchData]);

  const handleSearch = () => {
    const values = searchForm.getFieldsValue();
    setQuery((prev) => ({ ...prev, ...values, page: 1 }));
  };

  const handleReset = () => {
    searchForm.resetFields();
    setQuery({ page: 1, pageSize: 10 });
  };

  const handleAdd = () => {
    setEditRecord(null);
    modalForm.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: UserItem) => {
    setEditRecord(record);
    modalForm.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteUser(id);
    message.success('删除成功');
    fetchData(query);
  };

  const handleModalOk = async () => {
    const values = await modalForm.validateFields();
    setSubmitting(true);
    try {
      if (editRecord) {
        await updateUser(editRecord.id, values);
        message.success('更新成功');
      } else {
        await createUser(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData(query);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<UserItem> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '昵称', dataIndex: 'nickname' },
    { title: '邮箱', dataIndex: 'email', ellipsis: true },
    { title: '手机号', dataIndex: 'phone' },
    { title: '角色', dataIndex: 'role' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: number) =>
        status === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      width: 160,
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>用户管理</h2>

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="username">
            <Input placeholder="用户名" allowClear />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                搜索
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增用户
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            current: query.page,
            pageSize: query.pageSize,
            total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (page, pageSize) => setQuery((prev) => ({ ...prev, page, pageSize })),
          }}
        />
      </Card>

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editRecord ? '编辑用户' : '新增用户'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form form={modalForm} layout="vertical" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="nickname" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="email" label="邮箱" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="手机号">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
                <Select>
                  <Select.Option value="admin">管理员</Select.Option>
                  <Select.Option value="editor">编辑</Select.Option>
                  <Select.Option value="viewer">访客</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Select.Option value={1}>启用</Select.Option>
              <Select.Option value={0}>停用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
