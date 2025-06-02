export const fetchOrders = async ({ role, userId, storeId, query, status, startDate, endDate }) => {
    const params = new URLSearchParams({ role });
    if (userId) params.append('userId', userId);
    if (storeId) params.append('storeId', storeId);
    if (query) params.append('query', query);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const res = await fetch(`http://localhost:8081/api/orders/search?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
};
