import React from 'react';
import { useCart } from '../context/CartContext';

const Notification = () => {
  const { notification } = useCart();

  if (!notification) return null;

  const bgColor = notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${bgColor} text-white`}>
      <div className="flex items-center">
        <span className="mr-2">
          {notification.type === 'success' ? '✓' : 
           notification.type === 'error' ? '✗' : 'ℹ️'}
        </span>
        <span>{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;