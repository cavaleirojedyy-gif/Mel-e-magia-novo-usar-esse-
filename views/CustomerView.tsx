import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, Search, Filter, Sparkles, Plus, Minus, X, CreditCard, Clock, MapPin, Lock } from 'lucide-react';
import { Product, CartItem, Order, OrderStatus } from '../types';
import { MOCK_PRODUCTS, PROMO_CODES } from '../constants';
import { Button, Input, Badge, Card } from '../components/ui';
import { getAiRecommendation } from '../services/geminiService';

interface CustomerViewProps {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  placeOrder: (details: { address: string, payment: string, total: number }) => void;
  orderHistory: Order[];
  onAdminClick: () => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ 
  cart, addToCart, removeFromCart, updateQuantity, placeOrder, orderHistory, onAdminClick
}) => {
  const [view, setView] = useState<'menu' | 'cart' | 'orders'>('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Cart calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal * (1 - discount / 100);

  const categories = ['Todos', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];
  
  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAiAsk = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiThinking(true);
    const response = await getAiRecommendation(aiPrompt, MOCK_PRODUCTS);
    setAiResponse(response);
    setIsAiThinking(false);
  };

  const applyPromo = () => {
    const code = PROMO_CODES.find(c => c.code === promoCode.toUpperCase());
    if (code) {
      setDiscount(code.discountPercent);
      alert(`Cupom aplicado! ${code.discountPercent}% de desconto.`);
    } else {
      alert('Cupom inválido');
    }
  };

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <h1 className="text-xl font-bold text-amber-900">Mel & Magia</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onAdminClick} className="text-amber-800" title="Área Administrativa">
            <Lock size={20} />
          </Button>
          <Button variant="ghost" onClick={() => setView('orders')} className="relative" title="Meus Pedidos">
            <Clock size={20} />
          </Button>
          <Button variant="primary" onClick={() => setView('cart')} className="relative flex items-center gap-2">
            <ShoppingBag size={20} />
            {cart.length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        
        {view === 'menu' && (
          <>
            {/* AI Assistant Banner */}
            <Card className="mb-6 bg-gradient-to-r from-amber-500 to-orange-400 text-white border-none">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg mb-1">Chef Mel Virtual</h2>
                    <p className="text-amber-50 text-sm mb-3">Não sabe o que escolher? Me diga o que você gosta!</p>
                    <div className="flex gap-2">
                      <input 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Ex: Quero algo romântico..."
                        className="flex-1 px-3 py-2 rounded-lg text-gray-800 focus:outline-none"
                      />
                      <button 
                        onClick={handleAiAsk}
                        disabled={isAiThinking}
                        className="bg-white text-amber-600 px-4 py-2 rounded-lg font-bold hover:bg-amber-50 disabled:opacity-70"
                      >
                        {isAiThinking ? '...' : 'Perguntar'}
                      </button>
                    </div>
                    {aiResponse && (
                      <div className="mt-4 bg-white/10 p-3 rounded-lg text-sm border border-white/20">
                        {aiResponse}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar pão de mel..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === cat 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-white text-gray-600 hover:bg-amber-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="group hover:shadow-md transition-shadow">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-sm flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star size={12} fill="currentColor" /> {product.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Badge color="bg-amber-100 text-amber-800 mb-1 inline-block">{product.category}</Badge>
                        <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                      </div>
                      <span className="font-bold text-xl text-amber-600">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <Button 
                      className="w-full flex items-center justify-center gap-2"
                      onClick={() => addToCart(product)}
                    >
                      <Plus size={18} /> Adicionar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {view === 'cart' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={() => setView('menu')}>← Voltar</Button>
              <h2 className="text-2xl font-bold">Seu Carrinho</h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-amber-100">
                <ShoppingBag size={48} className="mx-auto text-amber-200 mb-4" />
                <p className="text-gray-500 text-lg">Seu carrinho está vazio.</p>
                <Button variant="outline" className="mt-4" onClick={() => setView('menu')}>Ver Cardápio</Button>
              </div>
            ) : (
              <div className="grid gap-6">
                <Card className="p-4 divide-y divide-amber-100">
                  {cart.map(item => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-bold text-gray-800">{item.name}</h4>
                          <span className="font-semibold text-gray-900">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{item.category}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-white shadow-sm text-gray-600 hover:text-amber-600">
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white shadow-sm text-gray-600 hover:text-amber-600">
                              <Plus size={14} />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:text-red-700 underline">
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>

                <Card className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="Cupom de desconto" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="secondary" onClick={applyPromo}>Aplicar</Button>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto ({discount}%)</span>
                        <span>- R$ {(subtotal * discount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Entrega</span>
                      <span>R$ 5.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-dashed border-gray-200">
                      <span>Total</span>
                      <span>R$ {(total + 5).toFixed(2)}</span>
                    </div>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      placeOrder({
                        address: formData.get('address') as string,
                        payment: formData.get('payment') as string,
                        total: total + 5
                      });
                      setView('orders');
                    }}
                    className="space-y-4"
                  >
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                      <Input name="address" required placeholder="Rua, Número, Bairro" defaultValue="Rua Exemplo, 123" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pagamento</label>
                      <select name="payment" className="w-full px-4 py-2 rounded-lg border border-amber-200 bg-white" required>
                        <option value="PIX">PIX (5% desc)</option>
                        <option value="Credit Card">Cartão de Crédito</option>
                        <option value="Cash">Dinheiro</option>
                      </select>
                    </div>

                    <Button type="submit" className="w-full py-3 text-lg shadow-amber-200">
                      Finalizar Pedido
                    </Button>
                  </form>
                </Card>
              </div>
            )}
          </div>
        )}

        {view === 'orders' && (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" onClick={() => setView('menu')}>← Voltar ao Menu</Button>
              <h2 className="text-2xl font-bold">Meus Pedidos</h2>
            </div>

            <div className="space-y-4">
              {orderHistory.slice().reverse().map(order => (
                <Card key={order.id} className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-800">#{order.id}</span>
                        <span className="text-xs text-gray-500">{order.timestamp.toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.items.length} itens • R$ {order.total.toFixed(2)}</p>
                    </div>
                    <Badge color={
                      order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' : 
                      order.status === OrderStatus.RECEIVED ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {order.status}
                    </Badge>
                  </div>
                  
                  {/* Status Progress Bar */}
                  {order.status !== OrderStatus.DELIVERED && (
                    <div className="mb-4">
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-500"
                          style={{ 
                            width: 
                              order.status === OrderStatus.RECEIVED ? '10%' :
                              order.status === OrderStatus.PREPARING ? '40%' :
                              order.status === OrderStatus.READY_FOR_PICKUP ? '70%' :
                              order.status === OrderStatus.ON_THE_WAY ? '90%' : '100%'
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
                         <span>Recebido</span>
                         <span>Preparo</span>
                         <span>Saiu</span>
                      </div>
                    </div>
                  )}

                  {order.status === OrderStatus.ON_THE_WAY && (
                    <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">Seu pedido está a caminho!</p>
                        <p className="text-xs text-blue-700">Entregador: {order.courierName || 'João Silva'}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <Button variant="outline" className="w-full text-sm">
                      Pedir Novamente
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};