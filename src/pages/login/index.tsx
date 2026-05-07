import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/api/user';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginParams } from '@/types/user';
import styles from './index.module.css';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const setAuth = useAuthStore((s) => s.setAuth);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  // 已登录则直接跳转
  if (token) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (values: LoginParams & { remember: boolean }) => {
    setLoading(true);
    try {
      const { token: newToken, user } = await login({
        username: values.username,
        password: values.password,
      });
      if (values.remember) {
        localStorage.setItem('rememberedUser', values.username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      setAuth(newToken, user);
      message.success('登录成功');
      navigate(from, { replace: true });
    } catch {
      // 错误已在 request 拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.subtitle}>后台管理系统</p>
        </div>
        <Form
          size="large"
          initialValues={{
            remember: true,
            username: localStorage.getItem('rememberedUser') || '',
          }}
          onFinish={handleSubmit}
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住账号</Checkbox>
              </Form.Item>
              <a href="#">忘记密码</a>
            </div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
