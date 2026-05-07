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
} from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getArticleList, createArticle, updateArticle, deleteArticle } from '@/api/article';
import type { ArticleItem, ArticleQueryParams, ArticleFormData } from '@/types/article';

const categories = ['技术', '产品', '运营', '设计', '其他'];

const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'default' },
  published: { label: '已发布', color: 'green' },
  archived: { label: '已归档', color: 'orange' },
};

export default function ArticlePage() {
  const [data, setData] = useState<ArticleItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<ArticleQueryParams>({ page: 1, pageSize: 10 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ArticleItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchForm] = Form.useForm();
  const [modalForm] = Form.useForm();

  const fetchData = useCallback(async (params: ArticleQueryParams) => {
    setLoading(true);
    try {
      const res = await getArticleList(params);
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

  const handleEdit = (record: ArticleItem) => {
    setEditRecord(record);
    modalForm.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteArticle(id);
    message.success('删除成功');
    fetchData(query);
  };

  const handleModalOk = async () => {
    const values: ArticleFormData = await modalForm.validateFields();
    setSubmitting(true);
    try {
      if (editRecord) {
        await updateArticle(editRecord.id, values);
        message.success('更新成功');
      } else {
        await createArticle(values);
        message.success('创建成功');
      }
      setModalOpen(false);
      fetchData(query);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<ArticleItem> = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', width: 280, ellipsis: true },
    { title: '分类', dataIndex: 'category', width: 80 },
    { title: '作者', dataIndex: 'author', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (s: string) => (
        <Tag color={statusMap[s]?.color}>{statusMap[s]?.label}</Tag>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      width: 90,
      sorter: (a, b) => a.viewCount - b.viewCount,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
    },
    {
      title: '操作',
      width: 140,
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
      <h2 style={{ marginBottom: 24 }}>文章管理</h2>

      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="title">
            <Input placeholder="文章标题" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="category">
            <Select placeholder="分类" allowClear style={{ width: 120 }}>
              {categories.map((c) => (
                <Select.Option key={c} value={c}>{c}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" allowClear style={{ width: 120 }}>
              {Object.entries(statusMap).map(([key, val]) => (
                <Select.Option key={key} value={key}>{val.label}</Select.Option>
              ))}
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

      <Card
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增文章
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1050 }}
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

      <Modal
        title={editRecord ? '编辑文章' : '新增文章'}
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => setModalOpen(false)}
        confirmLoading={submitting}
        destroyOnClose
        width={560}
      >
        <Form form={modalForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="title" label="文章标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true, message: '请选择分类' }]}>
            <Select>
              {categories.map((c) => (
                <Select.Option key={c} value={c}>{c}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="summary" label="摘要" rules={[{ required: true, message: '请输入摘要' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Select.Option value="draft">草稿</Select.Option>
              <Select.Option value="published">已发布</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
