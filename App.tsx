import React, { useState, useEffect } from 'react';
import { UserRole, Product, CartItem, Order, OrderStatus } from './types';
import { MOCK_ORDERS, MOCK_PRODUCTS } from './constants';
import { CustomerView } from './views/CustomerView';
import { AdminView } from './views/AdminView';
import { CourierView } from './views/CourierView';
import { Users, Lock } from 'lucide-react';
import { Card, Input, Button } from './components/ui';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

// Componente de Login do Admin
const AdminLogin: React.FC<{ onLogin: () => void, onCancel: () => void }> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Senha hardcoded para demonstração
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-amber-900/20 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-2xl border-amber-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
          <p className="text-gray-500 text-sm mt-2">Área exclusiva para gestão da Mel & Magia.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Administrador</label>
            <Input 
              type="password" 
              placeholder="Digite a senha..." 
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 font-semibold">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full py-3 text-lg">
            Entrar no Painel
          </Button>
          
          <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
            Voltar para Loja
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Dica para demo: a senha é <strong>admin123</strong></p>
        </div>
      </Card>
    </div>
  );
};

const App: React.FC = () => {
  // Global State
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Data State initialized with Mocks first to avoid empty screen if Supabase fails
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data from Supabase on load
  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured() || !supabase) {
        console.log('Supabase não configurado. Usando dados mockados.');
        return;
      }

      setIsLoading(true);
      try {
        // Fetch Products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (productsData && !productsError && productsData.length > 0) {
          // Map snake_case to camelCase if necessary (Supabase returns snake_case usually, but we define columns)
          // Ensure mapping matches TypeScript interface
          const mappedProducts: Product[] = productsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price),
            category: p.category,
            imageUrl: p.image_url || p.imageUrl, // Fallback
            rating: Number(p.rating),
            isAvailable: p.is_available ?? true
          }));
          setProducts(mappedProducts);
        }

        // Fetch Orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');

        if (ordersData && !ordersError && ordersData.length > 0) {
          const mappedOrders: Order[] = ordersData.map((o: any) => ({
            id: o.id,
            customerId: o.customer_id,
            customerName: o.customer_name,
            items: o.items, // JSONB column comes back as object
            total: Number(o.total),
            status: o.status as OrderStatus,
            timestamp: new Date(o.timestamp),
            address: o.address,
            paymentMethod: o.payment_method,
            courierName: o.courier_name
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Supabase:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cart Actions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const placeOrder = async (details: { address: string, payment: string, total: number }) => {
    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customerId: 'user-' + Math.floor(Math.random() * 1000),
      customerName: 'Você (Cliente Demo)',
      items: [...cart],
      total: details.total,
      status: OrderStatus.RECEIVED,
      timestamp: new Date(),
      address: details.address,
      paymentMethod: details.payment
    };

    // Optimistic Update
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    
    // Save to Supabase
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').insert({
          id: newOrder.id,
          customer_id: newOrder.customerId,
          customer_name: newOrder.customerName,
          items: newOrder.items,
          total: newOrder.total,
          status: newOrder.status,
          timestamp: newOrder.timestamp.toISOString(),
          address: newOrder.address,
          payment_method: newOrder.paymentMethod
        });
      } catch (err) {
        console.error("Erro ao salvar pedido no DB:", err);
        alert("Atenção: Erro ao salvar no banco de dados, mas o pedido foi registrado localmente.");
      }
    }
    
    alert("Pedido realizado com sucesso!");
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // Optimistic Update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('orders').update({ status }).eq('id', orderId);
      } catch (err) {
        console.error("Erro ao atualizar status no DB:", err);
      }
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    // Optimistic Update
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));

    if (isSupabaseConfigured() && supabase) {
      try {
        // Prepare object for DB (snake_case)
        const dbProduct = {
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          category: updatedProduct.category,
          image_url: updatedProduct.imageUrl,
          is_available: updatedProduct.isAvailable
        };

        const { error } = await supabase
          .from('products')
          .update(dbProduct)
          .eq('id', updatedProduct.id);
        
        if (error) throw error;
      } catch (err) {
        console.error("Erro ao atualizar produto no DB:", err);
        alert("Erro ao salvar alterações no banco de dados.");
      }
    }
  };

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role !== UserRole.ADMIN) {
      setIsAdminAuthenticated(false);
    }
  };

  const RoleSwitcher = () => (
    <div className="fixed bottom-4 left-4 z-50 group">
      <button className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-colors">
        <Users size={20} />
      </button>
      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden hidden group-hover:block min-w-[150px]">
        <div className="p-2 text-xs text-gray-500 font-bold uppercase border-b bg-gray-50">Alternar Visão</div>
        {[UserRole.CUSTOMER, UserRole.ADMIN, UserRole.COURIER].map(role => (
          <button
            key={role}
            onClick={() => handleRoleChange(role)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-amber-50 ${currentRole === role ? 'font-bold text-amber-600' : 'text-gray-700'}`}
          >
            {role === UserRole.CUSTOMER ? 'Cliente' : role === UserRole.ADMIN ? 'Gestor' : 'Entregador'}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50/50">
      <RoleSwitcher />
      
      {currentRole === UserRole.CUSTOMER && (
        <CustomerView 
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateQuantity={updateQuantity}
          placeOrder={placeOrder}
          orderHistory={orders.filter(o => o.customerId.includes('user') || o.customerId === 'current-user')} 
          onAdminClick={() => handleRoleChange(UserRole.ADMIN)}
        />
      )}

      {currentRole === UserRole.ADMIN && (
        !isAdminAuthenticated ? (
          <AdminLogin 
            onLogin={() => setIsAdminAuthenticated(true)} 
            onCancel={() => handleRoleChange(UserRole.CUSTOMER)} 
          />
        ) : (
          <AdminView 
            orders={orders}
            products={products}
            updateOrderStatus={updateOrderStatus}
            updateProduct={updateProduct}
            onExit={() => handleRoleChange(UserRole.CUSTOMER)}
          />
        )
      )}

      {currentRole === UserRole.COURIER && (
        <CourierView 
          orders={orders}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </div>
  );
};

export default App;