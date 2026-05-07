import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, ShoppingCartOutlined, FileTextOutlined, TeamOutlined } from '@ant-design/icons';
import ChatPanel from '@/components/chat/ChatPanel';

const stats = [
  { title: '用户总数', value: 12846, icon: <UserOutlined />, color: '#1677ff' },
  { title: '订单总量', value: 8846, icon: <ShoppingCartOutlined />, color: '#52c41a' },
  { title: '文章数量', value: 1356, icon: <FileTextOutlined />, color: '#faad14' },
  { title: '访问量', value: 98342, icon: <TeamOutlined />, color: '#eb2f96' },
];

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      {/* 左侧：指标卡片 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h2 style={{ marginBottom: 24 }}>工作台</h2>
        <Row gutter={[16, 16]}>
          {stats.map((item) => (
            <Col xs={24} sm={12} lg={12} xl={6} key={item.title}>
              <Card>
                <Statistic
                  title={item.title}
                  value={item.value}
                  prefix={<span style={{ color: item.color }}>{item.icon}</span>}
                />
              </Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="欢迎使用">
              <p>这是一个基于 React + TypeScript + Ant Design 构建的后台管理系统模板。</p>
              <p>技术栈：Vite / React 18 / TypeScript / Ant Design 5 / Zustand / React Router</p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 右侧：智能助手 */}
      <div style={{ width: 400, flexShrink: 0 }}>
        <ChatPanel />
      </div>
    </div>
  );
}
