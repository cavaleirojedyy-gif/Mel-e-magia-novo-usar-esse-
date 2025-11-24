import React from 'react';
import { MapPin, Navigation, Package, CheckCircle, Smartphone } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { Card, Button, Badge } from '../components/ui';

interface CourierViewProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const CourierView: React.FC<CourierViewProps> = ({ orders, updateOrderStatus }) => {
  const availableDeliveries = orders.filter(o => o.status === OrderStatus.READY_FOR_PICKUP);
  const myDeliveries = orders.filter(o => o.status === OrderStatus.ON_THE_WAY);

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-20">
      <header className="bg-amber-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Olá, Entregador</h1>
            <p className="text-amber-100 opacity-90">Você tem {myDeliveries.length} entregas ativas</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full">
            <Navigation size={24} />
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="bg-amber-700/50 flex-1 rounded-xl p-3">
            <span className="block text-2xl font-bold">R$ 120</span>
            <span className="text-xs text-amber-100">Ganhos hoje</span>
          </div>
          <div className="bg-amber-700/50 flex-1 rounded-xl p-3">
             <span className="block text-2xl font-bold">8</span>
             <span className="text-xs text-amber-100">Entregas</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        
        {/* Active Delivery */}
        {myDeliveries.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Navigation className="text-blue-500" size={20} /> Em Rota
            </h2>
            {myDeliveries.map(order => (
              <Card key={order.id} className="p-5 border-l-4 border-l-blue-500 shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">#{order.id} - {order.customerName}</h3>
                    <p className="text-gray-500 text-sm">{order.items.length} itens • Dinheiro</p>
                  </div>
                  <Button variant="ghost" className="p-2 h-10 w-10 rounded-full bg-blue-50 text-blue-600">
                    <Smartphone size={20} />
                  </Button>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-gray-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{order.address}</p>
                      <p className="text-xs text-gray-500">3.2 km • 10 min</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)}
                  >
                    Confirmar Entrega
                  </Button>
                </div>
              </Card>
            ))}
          </section>
        )}

        {/* Available Pickups */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Package className="text-amber-500" size={20} /> Disponíveis para Coleta
          </h2>
          
          {availableDeliveries.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum pedido aguardando coleta no momento.
            </div>
          ) : (
            <div className="space-y-3">
              {availableDeliveries.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700">Restaurante Mel & Magia</span>
                    <Badge color="bg-amber-100 text-amber-800">R$ 8,50 taxa</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin size={14} />
                    <span>Entrega em: {order.address}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                    onClick={() => updateOrderStatus(order.id, OrderStatus.ON_THE_WAY)}
                  >
                    Aceitar Rota
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};