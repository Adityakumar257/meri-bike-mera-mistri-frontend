import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderService } from '../services/api';

function AccountOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    OrderService.getUserOrders({ page: 1, limit: 50 })
      .then((response) => {
        if (!active) return;
        const result = response.data?.data;
        setOrders(Array.isArray(result?.docs) ? result.docs : Array.isArray(result) ? result : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load your orders.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-5 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/account" className="hover:text-blue-700">My account</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">Order history</span>
      </nav>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Order history</h1>

      {loading ? (
        <p className="py-12 text-center text-slate-600" role="status">Loading your orders…</p>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-red-800" role="alert">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl bg-slate-50 p-10 text-center">
          <p className="text-slate-700">You have not placed any orders yet.</p>
          <Link to="/category/all" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">
            Browse spare parts
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-5 py-4 font-medium text-slate-900">{order.orderNumber || order._id}</td>
                  <td className="px-5 py-4 text-slate-600">
                    {(order.orderDate || order.createdAt) ? new Date(order.orderDate || order.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-4 capitalize text-slate-700">{order.orderStatus || order.status || 'Processing'}</td>
                  <td className="px-5 py-4 font-semibold text-slate-900">
                    ₹{Number(order.totalAmount ?? order.total ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <Link to={`/order/${order._id}`} className="font-semibold text-blue-700 hover:underline">View order</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default AccountOrders;
