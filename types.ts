export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  COURIER = 'COURIER'
}

export enum OrderStatus {
  RECEIVED = 'Recebido',
  PREPARING = 'Em Preparo',
  READY_FOR_PICKUP = 'Aguardando Entregador',
  ON_THE_WAY = 'A Caminho',
  DELIVERED = 'Entregue'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Tradicional' | 'Gourmet' | 'Vegano' | 'Especial';
  imageUrl: string;
  rating: number;
  isAvailable: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
  address: string;
  courierName?: string;
  paymentMethod: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
}