export const fetchItemsByStoreId = async (storeId) => {
    const res = await fetch(`/api/order-items/store/${storeId}`);
    if (!res.ok) throw new Error('Failed to fetch items by store');
    return await res.json();
};
