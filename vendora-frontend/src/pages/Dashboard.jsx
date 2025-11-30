import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts'
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingBag,
  FiAward,
  FiActivity,
  FiBarChart2,
  FiDownload,
  FiX,
  FiPlus
} from 'react-icons/fi'
import { apiRequest } from '../services/api'

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

function Dashboard() {
  const { currentUser } = useSelector((state) => state.user)
  const [searchParams, setSearchParams] = useSearchParams()
  const [timeRange, setTimeRange] = useState(searchParams.get('timeRange') || '7d')
  const [kpis, setKpis] = useState(null)
  const [bidsData, setBidsData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [productCount, setProductCount] = useState({ total: 0, active: 0 })
  const [marketTrends, setMarketTrends] = useState(null)
  const [topAuctions, setTopAuctions] = useState([])
  const [recentBids, setRecentBids] = useState([])
  const [auctionTable, setAuctionTable] = useState({ data: [], pagination: {} })
  const [loading, setLoading] = useState(true)
  const [selectedAuction, setSelectedAuction] = useState(null)
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    category: searchParams.get('category') || ''
  })
  const [tablePage, setTablePage] = useState(parseInt(searchParams.get('page') || '1', 10))

  const role = currentUser?.role || 'admin'
  const userId = currentUser?.id

  useEffect(() => {
    fetchAllData()
    const interval = setInterval(() => {
      fetchAllData()
    }, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [timeRange, filters, tablePage, role, userId])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        time_range: timeRange,
        role,
        ...(userId && { user_id: userId }),
        ...(filters.status && { status: filters.status }),
        ...(filters.category && { category_id: filters.category }),
        page: tablePage,
        per_page: 20
      })

      const [kpisRes, bidsRes, topProductsRes, productCountRes, marketTrendsRes, topAuctionsRes, recentBidsRes, tableRes] = await Promise.allSettled([
        apiRequest(`/analytics/kpis?${params}`),
        apiRequest(`/analytics/bids_over_time?${params}&interval=hour`),
        apiRequest(`/analytics/top_products?${params}&limit=5`),
        apiRequest(`/analytics/product_count?${params}`),
        apiRequest(`/analytics/market_trends?${params}`),
        apiRequest(`/analytics/top_auctions?${params}&limit=5`),
        apiRequest(`/analytics/recent_bids?${params}&limit=10`),
        apiRequest(`/analytics/auction_table?${params}`)
      ])

      const parseResponse = async (result, defaultValue) => {
        if (result.status === 'fulfilled' && result.value.ok) {
          return await result.value.json()
        }
        console.warn('Failed to fetch data:', result.status === 'rejected' ? result.reason : 'Response not OK')
        return defaultValue
      }

      const [kpisData, bidsData, topProductsData, productCountData, marketTrendsData, topAuctionsData, recentBidsData, tableData] = await Promise.all([
        parseResponse(kpisRes, {}),
        parseResponse(bidsRes, { data: [] }),
        parseResponse(topProductsRes, { data: [] }),
        parseResponse(productCountRes, { total: 0, active: 0 }),
        parseResponse(marketTrendsRes, { success: false, error: 'Failed to load' }),
        parseResponse(topAuctionsRes, { data: [] }),
        parseResponse(recentBidsRes, { data: [] }),
        parseResponse(tableRes, { data: [], pagination: {} })
      ])

      setKpis(kpisData)
      setBidsData(bidsData.data || [])
      setTopProducts(topProductsData.data || [])
      setProductCount(productCountData)
      setMarketTrends(marketTrendsData)
      setTopAuctions(topAuctionsData.data || [])
      setRecentBids(recentBidsData.data || [])
      setAuctionTable(tableData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const kpiCards = useMemo(() => {
    if (!kpis) return []
    
    const deltas = kpis.deltas || {}
    
    return [
      {
        label: 'Active Auctions',
        value: kpis.active_auctions || 0,
        delta: calculateDelta(kpis.active_auctions, deltas.active_auctions),
        icon: FiTrendingUp,
        color: 'blue'
      },
      {
        label: 'Live Bids/min',
        value: kpis.live_bids_per_min || 0,
        delta: null,
        icon: FiActivity,
        color: 'purple'
      },
      {
        label: 'Total Revenue',
        value: formatCurrency(kpis.total_revenue || 0),
        delta: calculateDelta(kpis.total_revenue, deltas.total_revenue),
        icon: FiDollarSign,
        color: 'green'
      },
      {
        label: 'Conversion Rate',
        value: `${kpis.conversion_rate || 0}%`,
        delta: null,
        icon: FiBarChart2,
        color: 'amber'
      },
      {
        label: 'Items Sold',
        value: kpis.items_sold || 0,
        delta: calculateDelta(kpis.items_sold, deltas.items_sold),
        icon: FiShoppingBag,
        color: 'pink'
      }
    ]
  }, [kpis])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100">
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Header */}
          <header className="bg-white/6 backdrop-blur-sm border-b border-white/6 shadow-sm p-6 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                  <FiBarChart2 className="text-cyan-400" />
                  {role === 'admin' ? 'Admin Dashboard & Analytics' : 
                   role === 'seller' ? 'Seller Dashboard' : 
                   'Buyer Dashboard'}
                </h2>
                <p className="text-slate-400 mt-1 text-sm">
                  {role === 'admin' ? 'Global platform overview and analytics' :
                   role === 'seller' ? `Your listings and performance metrics` :
                   'Your watched items and bidding activity'}
                </p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-white/6 rounded-xl p-1">
                  {['24h', '7d', '30d', 'custom'].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setTimeRange(range)
                        setSearchParams(prev => {
                          const newParams = new URLSearchParams(prev)
                          newParams.set('timeRange', range)
                          return newParams
                        })
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        timeRange === range
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-sm'
                          : 'text-slate-300 hover:bg-white/8'
                      }`}
                    >
                      {range === 'custom' ? 'Custom' : range}
                    </button>
                  ))}
                </div>
                
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all flex items-center gap-2">
                  <FiDownload />
                  Export Report
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  {kpiCards.map((card, idx) => (
                    <KPICard key={idx} {...card} delay={idx * 0.1} />
                  ))}
                </div>

                {/* Charts & Widgets Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Bids Over Time */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2 flex-shrink-0">
                      <FiActivity className="text-cyan-400" />
                      Bids Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={bidsData}>
                        <defs>
                          <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="time" tick={{ fill: '#94a3b8' }} />
                        <YAxis tick={{ fill: '#94a3b8' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#e2e8f0'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#06b6d4"
                          fillOpacity={1}
                          fill="url(#colorBids)"
                        />
                        <Brush dataKey="time" height={30} stroke="#06b6d4" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Top Products */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2 flex-shrink-0">
                      <FiShoppingBag className="text-cyan-400" />
                      Top Products
                    </h3>
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
                      {topProducts.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">No products data available</p>
                      ) : (
                        topProducts.map((product, idx) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors border border-white/5"
                          >
                            <p className="font-semibold text-slate-100 truncate">{product.name}</p>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-slate-400">{product.bid_count} bids</p>
                              <p className="text-sm text-cyan-400 font-medium">
                                Max: {formatCurrency(product.max_bid)}
                              </p>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Market Trends Row */}
                <div className="grid grid-cols-1 gap-6 mb-6">
                  {/* Market Trends (AI-Powered) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2 flex-shrink-0">
                      <FiBarChart2 className="text-cyan-400" />
                      Market Trends (AI Analysis)
                    </h3>
                    {marketTrends?.success ? (
                      <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
                        {/* Market Sentiment */}
                        {marketTrends.analysis?.marketSentiment && (
                          <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 rounded-lg p-4 border border-indigo-500/30">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-slate-300">Market Sentiment</h4>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  marketTrends.analysis.marketSentiment.value === 'Bullish'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : marketTrends.analysis.marketSentiment.value === 'Bearish'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}
                              >
                                {marketTrends.analysis.marketSentiment.value}
                              </span>
                            </div>
                            <p className="text-slate-200 text-sm">{marketTrends.analysis.marketSentiment.description}</p>
                          </div>
                        )}

                        {/* Top Trending Products */}
                        {marketTrends.analysis?.topTrendingProducts && marketTrends.analysis.topTrendingProducts.length > 0 && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Top Trending Products</h4>
                            <div className="space-y-2">
                              {marketTrends.analysis.topTrendingProducts.map((product, idx) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-slate-100 font-medium text-sm">{product.name}</p>
                                      <p className="text-slate-400 text-xs mt-1">{product.analysis}</p>
                                    </div>
                                    <span className="ml-2 px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs font-medium">
                                      #{idx + 1}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Price Movements */}
                        {marketTrends.analysis?.priceMovements && marketTrends.analysis.priceMovements.length > 0 && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Price Movement Trends</h4>
                            <div className="space-y-2">
                              {marketTrends.analysis.priceMovements.map((movement, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5">
                                  <div className="flex-1">
                                    <p className="text-slate-100 font-medium text-sm">{movement.product}</p>
                                    <p className="text-slate-400 text-xs mt-1">{movement.details}</p>
                                  </div>
                                  <span
                                    className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                                      movement.trend === 'Increasing'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : movement.trend === 'Decreasing'
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                    }`}
                                  >
                                    {movement.trend}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {marketTrends.analysis?.recommendations && (
                          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <h4 className="text-sm font-semibold text-slate-300 mb-3">Market Recommendations</h4>
                            {marketTrends.analysis.recommendations.productsToWatch && marketTrends.analysis.recommendations.productsToWatch.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs text-slate-400 mb-2">Products to Watch:</p>
                                <div className="flex flex-wrap gap-2">
                                  {marketTrends.analysis.recommendations.productsToWatch.map((product, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs"
                                    >
                                      {product}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {marketTrends.analysis.recommendations.hotCategories && marketTrends.analysis.recommendations.hotCategories.length > 0 && (
                              <div>
                                <p className="text-xs text-slate-400 mb-2">Hot Categories:</p>
                                <div className="flex flex-wrap gap-2">
                                  {marketTrends.analysis.recommendations.hotCategories.map((category, idx) => (
                                    <span
                                      key={idx}
                                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Summary */}
                        {marketTrends.analysis?.summary && (
                          <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 rounded-lg p-4 border border-indigo-500/30">
                            <h4 className="text-sm font-semibold text-slate-300 mb-2">Summary</h4>
                            <p className="text-slate-200 text-sm leading-relaxed">{marketTrends.analysis.summary}</p>
                          </div>
                        )}

                        {/* Fallback: Show raw analysis if structured data is not available */}
                        {(!marketTrends.analysis || typeof marketTrends.analysis === 'string') && marketTrends.raw_analysis && (
                          <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 rounded-lg p-4 border border-indigo-500/30">
                            <div className="prose prose-invert max-w-none">
                              <div className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
                                {marketTrends.raw_analysis}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : marketTrends?.error ? (
                      <div className="text-slate-400 text-center py-8">
                        <p>Unable to load market trends</p>
                        <p className="text-xs mt-2">{marketTrends.message}</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                      </div>
                    )}
                  </motion.div>

                  {/* Top Auctions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 flex flex-col"
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2 flex-shrink-0">
                      <FiAward className="text-cyan-400" />
                      Top Auctions
                    </h3>
                    <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
                      {topAuctions && topAuctions.length > 0 ? (
                        topAuctions.slice(0, 5).map((auction, idx) => (
                          <motion.div
                            key={auction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + idx * 0.1 }}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors cursor-pointer border border-white/5"
                            onClick={() => setSelectedAuction(auction)}
                          >
                            <p className="font-semibold text-slate-100 truncate">{auction.name}</p>
                            <p className="text-sm text-slate-400 mt-1">
                              {formatCurrency(auction.top_bid)} • {auction.watchers} watchers
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-center py-4">No auctions data available</p>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Recent Bids & Auction Table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  {/* Recent Bids */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 flex flex-col h-full"
                  >
                    <h3 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                      <FiActivity className="text-cyan-400" />
                      Recent High-Value Bids
                    </h3>
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {recentBids && recentBids.length > 0 ? (
                        recentBids.map((bid, idx) => (
                        <motion.div
                          key={bid.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.05 }}
                          className="p-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-cyan-500/20 border border-indigo-500/30"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-slate-100">{formatCurrency(bid.amount)}</p>
                              <p className="text-sm text-slate-400">{bid.auction_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-300">{bid.bidder_name}</p>
                              <p className="text-xs text-slate-500">{formatTime(bid.created_at)}</p>
                            </div>
                          </div>
                        </motion.div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-center py-4">No recent bids available</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Auction Table */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="lg:col-span-2 bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                        <FiShoppingBag className="text-cyan-400" />
                        Auctions
                      </h3>
                      <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all flex items-center gap-2">
                        <FiPlus />
                        Create Auction
                      </button>
                    </div>
                    <div className="flex-1 overflow-x-auto overflow-y-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/6">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Auction</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Items</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Status</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Top Bid</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Watchers</th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-slate-300">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {auctionTable?.data && auctionTable.data.length > 0 ? (
                            auctionTable.data.map((auction) => (
                              <tr
                                key={auction.id}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <p className="font-semibold text-slate-100">{auction.name}</p>
                                  <p className="text-xs text-slate-400">{auction.creator}</p>
                                </td>
                                <td className="py-3 px-4 text-slate-300">{auction.item_count}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                      auction.status === 'running'
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        : auction.status === 'closed'
                                        ? 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    }`}
                                  >
                                    {auction.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-100">
                                  {formatCurrency(auction.top_bid)}
                                </td>
                                <td className="py-3 px-4 text-slate-300">{auction.watchers}</td>
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => setSelectedAuction(auction)}
                                    className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="py-8 text-center text-slate-400">
                                No auctions data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    {auctionTable.pagination && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-slate-400">
                          Page {auctionTable.pagination.page} of {auctionTable.pagination.total_pages}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newPage = Math.max(1, tablePage - 1)
                              setTablePage(newPage)
                              setSearchParams(prev => {
                                const newParams = new URLSearchParams(prev)
                                newParams.set('page', newPage.toString())
                                return newParams
                              })
                            }}
                            disabled={tablePage === 1}
                            className="px-4 py-2 rounded-lg border border-white/8 hover:bg-white/8 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => {
                              const newPage = tablePage + 1
                              setTablePage(newPage)
                              setSearchParams(prev => {
                                const newParams = new URLSearchParams(prev)
                                newParams.set('page', newPage.toString())
                                return newParams
                              })
                            }}
                            disabled={tablePage >= auctionTable.pagination.total_pages}
                            className="px-4 py-2 rounded-lg border border-white/8 hover:bg-white/8 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auction Detail Modal */}
      <AnimatePresence>
        {selectedAuction && (
          <AuctionDetailModal
            auction={selectedAuction}
            onClose={() => setSelectedAuction(null)}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

function KPICard({ label, value, delta, icon: Icon, color, delay }) {
  const colorClasses = {
    blue: 'from-indigo-600 to-cyan-500',
    purple: 'from-indigo-600 to-cyan-500',
    green: 'from-indigo-600 to-cyan-500',
    amber: 'from-indigo-600 to-cyan-500',
    pink: 'from-indigo-600 to-cyan-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="bg-white/6 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/6 cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} text-white`}>
          <Icon className="text-xl" />
        </div>
        {delta !== null && (
          <span
            className={`text-sm font-medium ${
              delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {delta > 0 ? '+' : ''}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-100 mb-1">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </motion.div>
  )
}

function AuctionDetailModal({ auction, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-slate-100">{auction.name}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/8 transition-colors text-slate-300"
          >
            <FiX className="text-xl" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Status</p>
            <p className="font-semibold text-slate-100 capitalize">{auction.status}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Top Bid</p>
            <p className="font-semibold text-slate-100">{formatCurrency(auction.top_bid)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Watchers</p>
            <p className="font-semibold text-slate-100">{auction.watchers}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Helper functions
function calculateDelta(current, previous) {
  if (!previous || previous === 0) return null
  return ((current - previous) / previous) * 100
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

function formatTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default Dashboard
