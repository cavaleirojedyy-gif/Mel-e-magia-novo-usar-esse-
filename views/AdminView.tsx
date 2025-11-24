import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, TrendingUp, Users, DollarSign, CheckCircle, Clock, LayoutGrid, List, Edit, X, Image as ImageIcon, Save, LogOut, ArrowLeft, Upload, Power } from 'lucide-react';
import { Order, OrderStatus, Product } from '../types';
import { Card, Badge, Button, Input, Textarea } from '../components/ui';

interface AdminViewProps {
  orders: Order[];
  products: Product[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateProduct: (product: Product) => void;
  onExit: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ orders, products, updateOrderStatus, updateProduct, onExit }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'menu'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Mock analytics data
  const salesData = [
    { name: 'Seg', sales: 1200 },
    { name: 'Ter', sales: 1500 },
    { name: 'Qua', sales: 1100 },
    { name: 'Qui', sales: 2300 },
    { name: 'Sex', sales: 3400 },
    { name: 'Sab', sales: 4500 },
    { name: 'Dom', sales: 3800 },
  ];

  const flavorPopularity = [
    { name: 'Tradicional', value: 85 },
    { name: 'Brigadeiro', value: 65 },
    { name: 'Pistache', value: 45 },
    { name: 'Vegano', value: 30 },
  ];

  // Quick images for easy editing
  const QUICK_IMAGES = [
    'https://picsum.photos/400/400?random=1',
    'https://picsum.photos/400/400?random=2',
    'https://picsum.photos/400/400?random=3',
    'https://picsum.photos/400/400?random=4',
    'https://picsum.photos/400/400?random=5',
    'https://picsum.photos/400/400?random=6',
    'https://picsum.photos/400/400?random=10',
    'https://picsum.photos/400/400?random=12',
  ];

  const activeOrders = orders.filter(o => o.status !== OrderStatus.DELIVERED);
  const revenue = orders.reduce((acc, curr) => acc + curr.total, 0);

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditingProduct({ ...editingProduct, imageUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-20 bg-gray-50/50 min-h-screen">
      {/* Header with Navigation */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onExit} className="text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-full w-10 h-10 p-0 flex items-center justify-center">
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel do Gestor</h1>
            <p className="text-gray-500 text-sm">Visão geral da operação e desempenho</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
           <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-start sm:self-auto">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-amber-100 text-amber-800' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <TrendingUp size={18} /> <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${activeTab === 'menu' ? 'bg-amber-100 text-amber-800' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <LayoutGrid size={18} /> <span className="hidden sm:inline">Cardápio</span>
            </button>
          </div>
          <Button variant="danger" onClick={onExit} className="flex items-center gap-2 text-sm self-start sm:self-auto">
            <LogOut size={16} /> <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>

      {activeTab === 'dashboard' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Vendas Totais', value: `R$ ${revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
              { label: 'Pedidos Ativos', value: activeOrders.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
              { label: 'Total Entregas', value: orders.filter(o => o.status === OrderStatus.DELIVERED).length, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100' },
              { label: 'Produtos', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
            ].map((stat, i) => (
              <Card key={i} className="p-6 flex items-center gap-4">
                <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-amber-600" /> Receita Semanal
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} prefix="R$" />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={3} dot={{r: 4, fill: '#d97706'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Popularity Chart */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Package size={20} className="text-amber-600" /> Popularidade
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={flavorPopularity} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Kanban-ish Order Board */}
          <h2 className="text-xl font-bold mb-4">Gerenciamento de Pedidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Novos / Em Preparo', status: [OrderStatus.RECEIVED, OrderStatus.PREPARING] },
              { title: 'Pronto para Entrega', status: [OrderStatus.READY_FOR_PICKUP] },
              { title: 'Em Trânsito', status: [OrderStatus.ON_THE_WAY] }
            ].map((column, colIdx) => (
              <div key={colIdx} className="bg-gray-100/50 rounded-xl p-4 border border-gray-200">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center justify-between">
                  {column.title}
                  <span className="bg-white border border-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full shadow-sm">
                    {orders.filter(o => column.status.includes(o.status)).length}
                  </span>
                </h3>
                <div className="space-y-3">
                  {orders
                    .filter(o => column.status.includes(o.status))
                    .map(order => (
                      <Card key={order.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900">#{order.id}</span>
                          <span className="text-xs text-gray-500">{new Date(order.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="font-medium text-sm mb-1">{order.customerName}</p>
                        <div className="text-xs text-gray-500 mb-3 space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx}>{item.quantity}x {item.name}</div>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-2">
                          {order.status === OrderStatus.RECEIVED && (
                            <Button 
                              className="w-full text-xs py-1" 
                              onClick={() => updateOrderStatus(order.id, OrderStatus.PREPARING)}
                            >
                              Aceitar & Preparar
                            </Button>
                          )}
                          {order.status === OrderStatus.PREPARING && (
                             <Button 
                              className="w-full text-xs py-1 bg-blue-600 hover:bg-blue-700" 
                              onClick={() => updateOrderStatus(order.id, OrderStatus.READY_FOR_PICKUP)}
                            >
                              Marcar Pronto
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                    {orders.filter(o => column.status.includes(o.status)).length === 0 && (
                      <div className="text-center text-gray-400 text-sm py-4">Vazio</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {products.map(product => (
             <Card key={product.id} className={`flex flex-col h-full group hover:ring-2 hover:ring-amber-200 transition-all ${!product.isAvailable ? 'opacity-60' : ''}`}>
               <div className="relative h-48 overflow-hidden bg-gray-100">
                 <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                 />
                 <div className="absolute top-2 right-2 flex gap-2">
                   <Badge color="bg-white/90 text-amber-800 backdrop-blur-sm shadow-sm">{product.category}</Badge>
                 </div>
                 {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Indisponível</span>
                    </div>
                 )}
               </div>
               <div className="p-4 flex-1 flex flex-col">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="font-bold text-gray-900">{product.name}</h3>
                   <span className="font-bold text-amber-600">R$ {product.price.toFixed(2)}</span>
                 </div>
                 <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{product.description}</p>
                 <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-amber-200 hover:bg-amber-50"
                    onClick={() => setEditingProduct(product)}
                 >
                   <Edit size={16} /> Editar Produto
                 </Button>
               </div>
             </Card>
           ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-amber-50">
              <h2 className="font-bold text-lg text-amber-900 flex items-center gap-2">
                <Edit size={20} /> Editar Produto
              </h2>
              <button 
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4">
              {/* Photo Editing Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Foto do Produto</label>
                <div className="flex gap-4 items-start">
                  <div className="bg-gray-100 w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm relative group">
                    {editingProduct.imageUrl ? (
                      <>
                        <img src={editingProduct.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </>
                    ) : (
                      <ImageIcon size={32} />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        value={editingProduct.imageUrl} 
                        onChange={e => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                        placeholder="Cole a URL ou carregue uma foto..."
                        className="text-sm flex-1"
                      />
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-lg border border-gray-200 transition-colors flex items-center justify-center" title="Carregar foto do computador">
                        <Upload size={18} />
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Ou selecione da galeria rápida:</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {QUICK_IMAGES.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditingProduct({...editingProduct, imageUrl: url})}
                            className={`w-10 h-10 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${editingProduct.imageUrl === url ? 'border-amber-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          >
                            <img src={url} alt={`Option ${idx}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input 
                    value={editingProduct.name} 
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                  <Input 
                    type="number"
                    step="0.01"
                    value={editingProduct.price} 
                    onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white transition-all hover:border-amber-300"
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}
                  >
                    <option value="Tradicional">Tradicional</option>
                    <option value="Gourmet">Gourmet</option>
                    <option value="Vegano">Vegano</option>
                    <option value="Especial">Especial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({...editingProduct, isAvailable: !editingProduct.isAvailable})}
                    className={`w-full px-4 py-2 rounded-lg border flex items-center justify-center gap-2 font-medium transition-all ${editingProduct.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                  >
                    <Power size={18} />
                    {editingProduct.isAvailable ? 'Disponível' : 'Indisponível'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Anúncio</label>
                <Textarea 
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Escreva um texto apetitoso e vendedor para atrair clientes.</p>
              </div>

              <div className="pt-4 flex gap-3 border-t border-gray-100 mt-2">
                 <Button type="button" variant="ghost" className="flex-1" onClick={() => setEditingProduct(null)}>
                   Cancelar
                 </Button>
                 <Button type="submit" className="flex-1 flex items-center justify-center gap-2 shadow-lg shadow-amber-100">
                   <Save size={18} /> Salvar Alterações
                 </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};