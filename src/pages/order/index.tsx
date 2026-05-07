import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Form,
  Tag,
  message,
  Modal,
  Descriptions,
} from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { getOrderList, updateOrderStatus } from '@/api/order';
import type { OrderItem, OrderQueryParams } from '@/types/order';

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: 'default' },
  processing: { label: '处理中', color: 'processing' },
  shipped: { label: '已发货', color: 'blue' },
  completed: { label: '已完成', color: 'green' },
  cancelled: { label: '已取消', color: 'red' },
};

const paymentMap: Record<string, string> = {
  wechat: '微信支付',
  alipay: '支付宝',
  card: '银行卡',
  cash: '现金',
};

const nextStatusMap: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['completed'],
};

export default function OrderPage() {
  const [data, setData] = useState<OrderItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<OrderQueryParams>({ page: 1, pageSize: 10 });
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState<OrderItem | null>(null);
  const [searchForm] = Form.useForm();

  const fetchData = useCallback(async (params: OrderQueryParams) => {
    setLoading(true);
    try {
      const res = await getOrderList(params);
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

  const handleView = (record: OrderItem) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  const handleStatusChange = async (id: number, newStatus: OrderItem['status']) => {
    try {
      await updateOrderStatus(id, newStatus);
      message.success('状态更新成功');
      fetchData(query);
    } catch {
      // 错误已在拦截器处理
    }
  };

  const columns: ColumnsType<OrderItem> = [
    { title: '订单号', dataIndex: 'orderNo', width: 180, ellipsis: true },
    { title: '客户', dataIndex: 'customerName', width: 100 },
    { title: '手机号', dataIndex: 'phone', width: 130 },
    { title: '商品', dataIndex: 'product', width: 120 },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 100,
      render: (v: number) => <span style={{ color: '#ff4d4f' }}>¥{v.toFixed(2)}</span>,
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      width: 100,
      render: (v: string) => paymentMap[v] || v,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 180,
      render: (status: string, record) => (
        <Space>
          <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>
          {nextStatusMap[status]?.map((next) => (
            <a
              key={next}
              style={{ fontSize: 12 }}
              onClick={() => handleStatusChange(record.id, next as OrderItem['status'])}
            >
              {status === 'pending' && next === 'cancelled' ? '取消' : ''}
              {status === 'pending' && next === 'processing' ? '处理' : ''}
              {status === 'processing' && next === 'shipped' ? '发货' : ''}
              {status === 'processing' && next === 'cancelled' ? '取消' : ''}
              {status === 'shipped' && next === 'completed' ? '完成' : ''}
            </a>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 170,
    },
    {
      title: '操作',
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>订单管理</h2>

      <Card style={{ marginBottom: 16 }}>
        <Form form={searchForm} layout="inline">
          <Form.Item name="orderNo">
            <Input placeholder="订单号" allowClear style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" allowClear style={{ width: 130 }}>
              {Object.entries(statusMap).map(([key, val]) => (
                <Select.Option key={key} value={key}>
                  {val.label}
                </Select.Option>
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

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data}
          loading={loading}
          scroll={{ x: 1300 }}
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
        title="订单详情"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
        width={560}
      >
        {detailRecord && (
          <Descriptions column={2} bordered size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="订单号">{detailRecord.orderNo}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusMap[detailRecord.status]?.color}>
                {statusMap[detailRecord.status]?.label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="客户">{detailRecord.customerName}</Descriptions.Item>
            <Descriptions.Item label="手机号">{detailRecord.phone}</Descriptions.Item>
            <Descriptions.Item label="商品">{detailRecord.product}</Descriptions.Item>
            <Descriptions.Item label="金额">¥{detailRecord.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="支付方式">
              {paymentMap[detailRecord.paymentMethod]}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">{detailRecord.createdAt}</Descriptions.Item>
            <Descriptions.Item label="备注" span={2}>
              {detailRecord.remark || '无'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}
