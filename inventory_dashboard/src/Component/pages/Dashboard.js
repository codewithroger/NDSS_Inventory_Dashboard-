import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: '', price: '', category: '' });
  const [editingProduct, setEditingProduct] = useState(null);
  const [editValues, setEditValues] = useState({ name: '', quantity: '', price: '', category: '' });
  const [error, setError] = useState(null);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/products', { headers: authHeaders });
      setProducts(res.data);
    } catch (err) {
      console.error('Fetch products failed:', err.response?.data || err.message);
      setError('Failed to load products. Please try again later.');
    }
  }, [token, authHeaders]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const isValidProduct = (prod) => {
    return (
      prod.name.trim() &&
      prod.category.trim() &&
      !isNaN(prod.quantity) &&
      Number(prod.quantity) >= 0 &&
      !isNaN(prod.price) &&
      Number(prod.price) >= 0
    );
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isValidProduct(newProduct)) {
      setError('Please fill all fields with valid values.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/products',
        {
          ...newProduct,
          quantity: Number(newProduct.quantity),
          price: Number(newProduct.price),
        },
        { headers: authHeaders }
      );
      setNewProduct({ name: '', quantity: '', price: '', category: '' });
      fetchProducts();
    } catch (err) {
      console.error('Add product failed:', err.response?.data || err.message);
      setError('Failed to add product.');
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, { headers: authHeaders });
      fetchProducts();
    } catch (err) {
      console.error('Delete product failed:', err.response?.data || err.message);
      setError('Failed to delete product.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!isValidProduct(editValues)) {
      setError('Please fill all fields with valid values.');
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        {
          ...editValues,
          quantity: Number(editValues.quantity),
          price: Number(editValues.price),
        },
        { headers: authHeaders }
      );
      closeEditModal();
      fetchProducts();
    } catch (err) {
      console.error('Update product failed:', err.response?.data || err.message);
      setError('Failed to update product.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditValues({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      category: product.category,
    });
  };

  const closeEditModal = () => {
    setEditingProduct(null);
    setError(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Inventory Management</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow"
        >
          Logout
        </button>
      </header>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Add Product */}
      <section className="bg-white p-6 rounded-lg shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Product</h2>
        <form
          onSubmit={handleAdd}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {['name', 'quantity', 'price', 'category'].map((field) => (
            <input
              key={field}
              type={field === 'quantity' || field === 'price' ? 'number' : 'text'}
              min={field === 'quantity' || field === 'price' ? '0' : undefined}
              step={field === 'price' ? '0.01' : undefined}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-300"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newProduct[field]}
              onChange={(e) =>
                setNewProduct({ ...newProduct, [field]: e.target.value })
              }
              required
            />
          ))}
          <button
            type="submit"
            className="sm:col-span-2 lg:col-span-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition shadow"
          >
            Add Product
          </button>
        </form>
      </section>

      {/* Product Table */}
      <section className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              {['Name', 'Quantity', 'Price', 'Category', 'Actions'].map((header) => (
                <th key={header} className="text-left p-3 font-medium text-gray-700">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.quantity}</td>
                  <td className="p-3">₹ {p.price}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              {['name', 'quantity', 'price', 'category'].map((field) => (
                <input
                  key={field}
                  name={field}
                  type={field === 'quantity' || field === 'price' ? 'number' : 'text'}
                  min={field === 'quantity' || field === 'price' ? '0' : undefined}
                  step={field === 'price' ? '0.01' : undefined}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={editValues[field]}
                  onChange={(e) =>
                    setEditValues({ ...editValues, [field]: e.target.value })
                  }
                  required
                />
              ))}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
                >
                  Save
                </button>
              </div>
            </form>
            <button
              onClick={closeEditModal}
              className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-600"
              aria-label="Close edit modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
