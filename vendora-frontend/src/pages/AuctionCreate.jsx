import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiPlus, FiX, FiArrowLeft } from 'react-icons/fi'

const API_BASE = 'http://localhost:5000'

function AuctionCreate() {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    start_time: '',
    end_time: '',
    base_price: '',
    products: [
      {
        name: '',
        description: '',
        category: '',
        starting_price: '',
        reserve_price: '',
        ai_suggested_price: 'Coming soon'
      }
    ]
  })

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          name: '',
          description: '',
          category: '',
          starting_price: '',
          reserve_price: '',
          ai_suggested_price: 'Coming soon'
        }
      ]
    })
  }

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      setFormData({
        ...formData,
        products: formData.products.filter((_, i) => i !== index)
      })
    }
  }

  const updateProduct = (index, field, value) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index][field] = value
    setFormData({ ...formData, products: updatedProducts })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        auction: {
          name: formData.name,
          created_by: currentUser?.id,
          start_time: formData.start_time,
          end_time: formData.end_time,
          starting_price: formData.base_price || 0,
          status: 'scheduled',
          visibility: 'public',
          currency: 'INR'
        },
        products: formData.products.map((product) => ({
          name: product.name,
          description: product.description,
          category_name: product.category,
          starting_price: product.starting_price || 0,
          reserve_price: product.reserve_price || 0
        }))
      }

      const response = await fetch(`${API_BASE}/auctions/create_with_products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create auction')
      }

      const data = await response.json()
      navigate(`/auction/${data.auction.id}/details`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/8 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Create New Auction
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Add auction details and products to get started
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6"
          >
            <h2 className="text-xl font-bold mb-4">Auction Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Auction Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  placeholder="Enter auction name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Base Price (Optional)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.base_price}
                  onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          </motion.div>

          {/* Products */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Products</h2>
              <button
                type="button"
                onClick={addProduct}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all flex items-center gap-2"
              >
                <FiPlus />
                Add Product
              </button>
            </div>

            {formData.products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Product {index + 1}</h3>
                  {formData.products.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="p-2 rounded-lg hover:bg-white/8 transition-colors text-red-400"
                    >
                      <FiX className="text-xl" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={product.description}
                      onChange={(e) => updateProduct(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none"
                      placeholder="Enter product description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={product.category}
                      onChange={(e) => updateProduct(index, 'category', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                      placeholder="Enter category name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Starting Price *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={product.starting_price}
                        onChange={(e) => updateProduct(index, 'starting_price', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Reserve Price
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={product.reserve_price}
                        onChange={(e) => updateProduct(index, 'reserve_price', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        AI Suggested Price
                      </label>
                      <input
                        type="text"
                        disabled
                        value={product.ai_suggested_price}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-white/6 border border-white/8 text-slate-300 rounded-xl hover:bg-white/8 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Auction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuctionCreate

