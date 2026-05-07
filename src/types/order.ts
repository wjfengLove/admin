export interface OrderItem {
  id: number;
  orderNo: string;
  customerName: string;
  phone: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  paymentMethod: 'wechat' | 'alipay' | 'card' | 'cash';
  createdAt: string;
  remark: string;
}

export interface OrderQueryParams {
  orderNo?: string;
  status?: OrderItem['status'];
  page: number;
  pageSize: number;
}
