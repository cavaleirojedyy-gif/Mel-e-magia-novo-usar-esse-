import { Product, Order, OrderStatus } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pão de Mel Tradicional',
    description: 'Massa fofinha com especiarias, recheio de doce de leite caseiro e cobertura de chocolate ao leite.',
    price: 8.50,
    category: 'Tradicional',
    imageUrl: 'https://picsum.photos/400/400?random=1',
    rating: 4.8,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Brigadeiro Belga',
    description: 'Recheio cremoso de brigadeiro feito com chocolate belga 70%.',
    price: 10.90,
    category: 'Gourmet',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    rating: 4.9,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Beijinho de Coco',
    description: 'Recheio de coco fresco cremoso com cobertura de chocolate branco.',
    price: 9.50,
    category: 'Tradicional',
    imageUrl: 'https://picsum.photos/400/400?random=3',
    rating: 4.6,
    isAvailable: true
  },
  {
    id: '4',
    name: 'Pão de Mel Vegano',
    description: 'Sem mel e sem leite. Adoçado com melado de cana e recheio de ganache de biomassa.',
    price: 12.00,
    category: 'Vegano',
    imageUrl: 'https://picsum.photos/400/400?random=4',
    rating: 4.5,
    isAvailable: true
  },
  {
    id: '5',
    name: 'Pistache Supremo',
    description: 'Recheio abundante de creme de pistache e pedaços de pistache na cobertura.',
    price: 14.50,
    category: 'Gourmet',
    imageUrl: 'https://picsum.photos/400/400?random=5',
    rating: 5.0,
    isAvailable: true
  },
  {
    id: '6',
    name: 'Box Degustação',
    description: 'Caixa com 4 mini pães de mel (Doce de leite, Brigadeiro, Ninho, Geleia de Morango).',
    price: 32.00,
    category: 'Especial',
    imageUrl: 'https://picsum.photos/400/400?random=6',
    rating: 4.9,
    isAvailable: true
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    customerId: 'user1',
    customerName: 'Ana Silva',
    items: [
      { ...MOCK_PRODUCTS[0], quantity: 2 },
      { ...MOCK_PRODUCTS[1], quantity: 1 }
    ],
    total: 27.90,
    status: OrderStatus.DELIVERED,
    timestamp: new Date(Date.now() - 86400000), // Yesterday
    address: 'Rua das Flores, 123 - Centro',
    paymentMethod: 'PIX'
  },
  {
    id: 'ORD-002',
    customerId: 'user2',
    customerName: 'Carlos Oliveira',
    items: [
      { ...MOCK_PRODUCTS[4], quantity: 4 }
    ],
    total: 58.00,
    status: OrderStatus.PREPARING,
    timestamp: new Date(),
    address: 'Av. Paulista, 1000 - Apt 402',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-003',
    customerId: 'user3',
    customerName: 'Mariana Costa',
    items: [
      { ...MOCK_PRODUCTS[5], quantity: 1 }
    ],
    total: 32.00,
    status: OrderStatus.READY_FOR_PICKUP,
    timestamp: new Date(),
    address: 'Rua Augusta, 500',
    paymentMethod: 'Cash'
  }
];

export const PROMO_CODES = [
  { code: 'BEMVINDO10', discountPercent: 10 },
  { code: 'MEL15', discountPercent: 15 }
];