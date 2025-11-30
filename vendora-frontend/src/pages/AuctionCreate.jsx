import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiPlus, FiX, FiArrowLeft, FiSearch, FiZap } from 'react-icons/fi'
import { apiRequest } from '../services/api'

function AuctionCreate() {
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Product search state
  const [searchQueries, setSearchQueries] = useState({}) // { productIndex: query }
  const [searchResults, setSearchResults] = useState({}) // { productIndex: results }
  const [showDropdown, setShowDropdown] = useState({}) // { productIndex: boolean }
  const [searchLoading, setSearchLoading] = useState({}) // { productIndex: boolean }
  const [priceSuggestions, setPriceSuggestions] = useState({}) // { productIndex: suggestion }
  const [suggestingPrice, setSuggestingPrice] = useState({}) // { productIndex: boolean }
  const searchTimeoutRefs = useRef({})
  const dropdownRefs = useRef({})

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
    
    // If product name changed, trigger search
    if (field === 'name' && value.length >= 2) {
      handleProductSearch(index, value)
    } else if (field === 'name' && value.length < 2) {
      // Clear search results if query is too short
      setSearchResults(prev => ({ ...prev, [index]: [] }))
      setShowDropdown(prev => ({ ...prev, [index]: false }))
    }
  }

  // Throttled product search
  const handleProductSearch = (index, query) => {
    // Clear previous timeout
    if (searchTimeoutRefs.current[index]) {
      clearTimeout(searchTimeoutRefs.current[index])
    }

    // Set search query
    setSearchQueries(prev => ({ ...prev, [index]: query }))
    setSearchLoading(prev => ({ ...prev, [index]: true }))

    // Throttle: wait 500ms after user stops typing
    searchTimeoutRefs.current[index] = setTimeout(async () => {
      try {
        const response = await apiRequest(`/products/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(prev => ({ ...prev, [index]: data.products || [] }))
          setShowDropdown(prev => ({ ...prev, [index]: true }))
        }
      } catch (err) {
        console.error('Search error:', err)
        setSearchResults(prev => ({ ...prev, [index]: [] }))
      } finally {
        setSearchLoading(prev => ({ ...prev, [index]: false }))
      }
    }, 500)
  }

  // Select a product from search results
  const selectProduct = async (index, product) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index].name = product.name
    updatedProducts[index].description = product.description || ''
    updatedProducts[index].category = product.category || ''
    
    setFormData({ ...formData, products: updatedProducts })
    setShowDropdown(prev => ({ ...prev, [index]: false }))
    setSearchResults(prev => ({ ...prev, [index]: [] }))
    
    // Get AI price suggestion
    await getPriceSuggestion(index, product.name)
  }

  // Get AI price suggestion for selected product
  const getPriceSuggestion = async (index, productName) => {
    if (!productName || productName.trim().length < 2) return

    setSuggestingPrice(prev => ({ ...prev, [index]: true }))
    
    try {
      const response = await apiRequest('/products/suggest_price', {
        method: 'POST',
        body: JSON.stringify({ product_name: productName })
      })

      if (response.ok) {
        const data = await response.json()
        setPriceSuggestions(prev => ({ ...prev, [index]: data }))
        
        // Auto-fill suggested prices
        const updatedProducts = [...formData.products]
        if (data.price_range) {
          updatedProducts[index].starting_price = data.price_range.suggested_starting || ''
          updatedProducts[index].reserve_price = data.price_range.suggested_reserve || ''
          updatedProducts[index].ai_suggested_price = 
            `₹${data.price_range.min} - ₹${data.price_range.max} (Avg: ₹${data.price_range.average})`
        }
        setFormData({ ...formData, products: updatedProducts })
      }
    } catch (err) {
      console.error('Price suggestion error:', err)
      const updatedProducts = [...formData.products]
      updatedProducts[index].ai_suggested_price = 'Unable to fetch price suggestion'
      setFormData({ ...formData, products: updatedProducts })
    } finally {
      setSuggestingPrice(prev => ({ ...prev, [index]: false }))
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(index => {
        if (dropdownRefs.current[index] && !dropdownRefs.current[index].contains(event.target)) {
          setShowDropdown(prev => ({ ...prev, [index]: false }))
        }
      })
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

      const response = await apiRequest('/auctions/create_with_products', {
        method: 'POST',
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
                  <div className="relative">
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Product Name *
                    </label>
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        onFocus={() => {
                          if (searchResults[index]?.length > 0) {
                            setShowDropdown(prev => ({ ...prev, [index]: true }))
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-100 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                        placeholder="Search or enter product name"
                      />
                      {searchLoading[index] && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {showDropdown[index] && searchResults[index]?.length > 0 && (
                      <div
                        ref={el => dropdownRefs.current[index] = el}
                        className="absolute z-10 w-full mt-1 bg-slate-800 border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                      >
                        {searchResults[index].map((result) => (
                          <button
                            key={result.id}
                            type="button"
                            onClick={() => selectProduct(index, result)}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                          >
                            <div className="font-medium text-slate-200">{result.name}</div>
                            {result.description && (
                              <div className="text-sm text-slate-400 mt-1 line-clamp-1">
                                {result.description}
                              </div>
                            )}
                            {result.category && (
                              <div className="text-xs text-cyan-400 mt-1">{result.category}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
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
                      <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-2">
                        <FiZap className="text-cyan-400" />
                        AI Suggested Price
                        {suggestingPrice[index] && (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-cyan-400"></div>
                        )}
                      </label>
                      <input
                        type="text"
                        disabled
                        value={product.ai_suggested_price}
                        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/8 text-slate-400 cursor-not-allowed"
                      />
                      {priceSuggestions[index] && (
                        <div className="mt-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                          <p className="text-xs text-cyan-400 mb-1">
                            {priceSuggestions[index].source === 'auction_history' 
                              ? '📊 Based on successful auctions' 
                              : '🤖 AI market research'}
                          </p>
                          {priceSuggestions[index].price_range && (
                            <div className="text-xs text-slate-300 space-y-1">
                              <div>Min: ₹{priceSuggestions[index].price_range.min}</div>
                              <div>Max: ₹{priceSuggestions[index].price_range.max}</div>
                              <div>Avg: ₹{priceSuggestions[index].price_range.average}</div>
                            </div>
                          )}
                          {priceSuggestions[index].message && (
                            <p className="text-xs text-slate-400 mt-2">
                              {priceSuggestions[index].message}
                            </p>
                          )}
                        </div>
                      )}
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

