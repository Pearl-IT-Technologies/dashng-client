import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface RealTimeUpdatesProps {
  // Empty props as this is a global component
}

const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = () => {
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Create WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);

    // Connection opened
    newSocket.addEventListener('open', () => {
      console.log('WebSocket Connected');
    });

    // Listen for messages
    newSocket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types
        switch(message.type) {
          case 'new_order':
            // Show a notification for new orders
            toast({
              title: `${message.data.isInStore ? 'New In-Store Order' : 'New Online Order'}!`,
              description: `Order #${message.data.order.id} has been created ${message.data.isInStore ? 'in the store by ' + message.data.adminName : 'online'}.`,
              // Using description for icon information
              duration: 5000,
            });
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
            break;
            
          case 'inventory_update':
            // Show a notification for inventory updates
            toast({
              title: 'Inventory Updated',
              description: `${message.data.productName} stock ${message.data.action === 'increase' ? 'increased' : 'decreased'} by ${Math.abs(message.data.change)} units.`,
              // Using description for icon information
              duration: 5000,
            });
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['/api/products'] });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
            break;
            
          case 'order_status_update':
            // Show a notification for order status updates
            toast({
              title: 'Order Status Updated',
              description: `Order #${message.data.orderId} status changed to "${message.data.newStatus}".`,
              // Using description for icon information
              duration: 5000,
            });
            
            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
            queryClient.invalidateQueries({ queryKey: ['/api/orders', message.data.orderId] });
            break;
            
          case 'dashboard_data':
            // This is automatically handled by dashboard components
            break;
            
          default:
            console.log('Unhandled message type:', message.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle errors
    newSocket.addEventListener('error', (error) => {
      console.error('WebSocket Error:', error);
      toast({
        title: 'Connection Error',
        description: 'Could not connect to real-time updates service.',
        variant: 'destructive',
      });
    });

    // Handle disconnection
    newSocket.addEventListener('close', () => {
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        setSocket(null); // This will trigger a re-connection on the next render
      }, 5000);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, [toast]);

  return null; // This component doesn't render anything visible
};

export default RealTimeUpdates;