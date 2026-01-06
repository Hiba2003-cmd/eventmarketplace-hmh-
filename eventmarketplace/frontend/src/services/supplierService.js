const API_BASE_URL = 'http://localhost:8080/api';

export const supplierService = {
  async registerSupplier(data) {
    const response = await fetch(`${API_BASE_URL}/suppliers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to register supplier');
    return response.json();
  },

  async getAllSuppliers() {
    const response = await fetch(`${API_BASE_URL}/suppliers`);
    if (!response.ok) throw new Error('Failed to fetch supplier');
    return response.json();
  },

  async getSupplierByUserId(id) {
    const response = await fetch(`${API_BASE_URL}/suppliers/user/${id}`);
    if (!response.ok) throw new Error('Failed to fetch supplier');
    return response.json();
  },

  async updateSupplier(id, data) {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update supplier');
    return response.json();
  },

  async deleteSupplier(id) {
    const response = await fetch(`${API_BASE_URL}/suppliers/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete supplier');
    return response.text();
  }
};