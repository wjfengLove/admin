import { lazy, Suspense } from 'react';
import type { FC, LazyExoticComponent } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import AuthGuard from '@/components/AuthGuard';
import BasicLayout from '@/layouts/BasicLayout';

const Login = lazy(() => import('@/pages/login'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const User = lazy(() => import('@/pages/user'));
const Order = lazy(() => import('@/pages/order'));
const Article = lazy(() => import('@/pages/article'));
const Settings = lazy(() => import('@/pages/settings'));

function LazyLoad(Component: LazyExoticComponent<FC>) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Spin size="large" />
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: LazyLoad(Login),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <BasicLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: LazyLoad(Dashboard) },
      { path: 'user', element: LazyLoad(User) },
      { path: 'order', element: LazyLoad(Order) },
      { path: 'article', element: LazyLoad(Article) },
      { path: 'settings', element: LazyLoad(Settings) },
    ],
  },
]);
