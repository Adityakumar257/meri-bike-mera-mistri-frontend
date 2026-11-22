import React, { useState } from 'react';
import { FaCreditCard, FaDollarSign, FaSearch, FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';

const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'cancelled'];

const PaymentsManagement = ({
  payments = [],
  dashboardStats = {},
  loading = {},
  requireAuth,
  setError,
  setSuccessMessage,
  API_BASE_URL,
  getAuthHeaders,
  fetchPayments
}) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const updatePaymentStatus = async (payment, paymentStatus) => {
    if (!requireAuth('update payment status')) return;

    setUpdatingId(payment.id);
    try {
      await axios.patch(`${API_BASE_URL}/orders/${payment.id}/payment-status`, { paymentStatus }, {
        headers: getAuthHeaders()
      });
      setSuccessMessage('Payment status updated.');
      await fetchPayments();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update payment status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = [
      payment.orderId,
      payment.customerName,
      payment.customerEmail,
      payment.transactionId
    ].some(value => String(value || '').toLowerCase().includes(normalizedSearch));
    return matchesSearch && (status === 'all' || payment.status === status);
  });

  const formatCurrency = amount => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(amount) || 0);

  const formatDate = date => date
    ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <p className="mt-2 text-gray-600">View payment records linked to existing customer orders.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-md">
          <div>
            <p className="text-sm text-gray-600">Paid Revenue</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardStats.totalRevenue)}</p>
          </div>
          <FaDollarSign className="text-2xl text-[#0b4b96]" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-md">
          <div>
            <p className="text-sm text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(dashboardStats.monthlyRevenue)}</p>
          </div>
          <FaCreditCard className="text-2xl text-[#0b4b96]" />
        </div>
        <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-md">
          <div>
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-gray-800">{dashboardStats.pendingOrders || 0}</p>
          </div>
          <FaShoppingCart className="text-2xl text-[#0b4b96]" />
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search payments</span>
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search order, customer or transaction"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 focus:border-[#0b4b96] focus:outline-none focus:ring-2 focus:ring-[#0b4b96]/20"
          />
        </label>
        <select
          aria-label="Filter by payment status"
          value={status}
          onChange={event => setStatus(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-[#0b4b96] focus:outline-none"
        >
          <option value="all">All payment statuses</option>
          {[...PAYMENT_STATUSES, 'refunded'].map(paymentStatus => (
            <option key={paymentStatus} value={paymentStatus}>{paymentStatus}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order', 'Customer', 'Date', 'Amount', 'Method', 'Transaction', 'Status'].map(label => (
                  <th key={label} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading.payments ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-500">Loading payment records…</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan="7" className="px-5 py-10 text-center text-gray-500">No payment records match these filters.</td></tr>
              ) : filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">{payment.orderId || '—'}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">
                    <div>{payment.customerName || 'Customer'}</div>
                    <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">{formatDate(payment.paymentDate)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">{payment.paymentMethod || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">{payment.transactionId || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4">
                    {PAYMENT_STATUSES.includes(payment.status) ? (
                      <select
                        aria-label={`Payment status for order ${payment.orderId}`}
                        value={payment.status}
                        disabled={updatingId === payment.id}
                        onChange={event => updatePaymentStatus(payment, event.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#0b4b96] focus:outline-none disabled:opacity-50"
                      >
                        {PAYMENT_STATUSES.map(paymentStatus => (
                          <option key={paymentStatus} value={paymentStatus}>{paymentStatus}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                        {payment.status || 'unknown'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsManagement;
