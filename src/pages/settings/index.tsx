import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Tabs,
  Divider,
  message,
  Spin,
  Row,
  Col,
} from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { getSettings, updateSettings } from '@/api/user';
import type { SystemSettings } from '@/types/user';

export default function SettingsPage() {
  const [form] = Form.useForm<SystemSettings>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSettings();
      form.setFieldsValue(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await updateSettings(values);
      message.success('保存成功');
    } finally {
      setSaving(false);
    }
  };

  const tabItems = [
    {
      key: 'basic',
      label: '基本设置',
      children: (
        <>
          <Form.Item name="siteName" label="站点名称" rules={[{ required: true, message: '请输入站点名称' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="https://example.com/logo.png" />
          </Form.Item>
          <Form.Item name="description" label="站点描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="recordNumber" label="备案号">
            <Input placeholder="粤ICP备XXXXXXXX号" />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'security',
      label: '安全设置',
      children: (
        <>
          <Form.Item
            name="loginRetryLimit"
            label="登录重试限制"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber min={1} max={20} style={{ width: 200 }} addonAfter="次" />
          </Form.Item>
          <Form.Item
            name="sessionTimeout"
            label="会话超时时间"
            rules={[{ required: true, message: '请输入' }]}
          >
            <InputNumber min={5} max={1440} style={{ width: 200 }} addonAfter="分钟" />
          </Form.Item>
          <Form.Item name="enableRegister" label="开放注册" valuePropName="checked">
            <Switch />
          </Form.Item>
        </>
      ),
    },
    {
      key: 'notification',
      label: '通知设置',
      children: (
        <>
          <Form.Item name="enableNotification" label="启用通知" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Divider>邮件服务</Divider>
          <Form.Item name="mailHost" label="SMTP 服务器">
            <Input placeholder="smtp.example.com" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="mailPort" label="端口">
                <InputNumber min={1} max={65535} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mailUser" label="发件邮箱">
                <Input placeholder="noreply@example.com" />
              </Form.Item>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>系统设置</h2>
      <Card>
        <Form form={form} layout="vertical">
          <Tabs items={tabItems} />
        </Form>
        <Divider />
        <div style={{ display: 'flex', gap: 12 }}>
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
            保存设置
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchSettings}>
            重置
          </Button>
        </div>
      </Card>
    </div>
  );
}
