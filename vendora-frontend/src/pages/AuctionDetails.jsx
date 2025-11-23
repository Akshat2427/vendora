import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuctionById } from '../store/slices/auctionSlice'
import { MdArrowBack, MdCalendarToday, MdAttachMoney, MdPerson, MdStar } from 'react-icons/md'

function AuctionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { auctions, loading, error } = useSelector((state) => state.auctions)
  const { currentUser } = useSelector((state) => state.user)

  const auction = auctions.find((a) => a.id === parseInt(id))

  useEffect(() => {
    if (id && !auction) {
      dispatch(fetchAuctionById(parseInt(id)))
    }
  }, [id, auction, dispatch])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'ended':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading auction details...</p>
        </div>
      </div>
    )
  }

  if (error || !auction) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error: {error || 'Auction not found'}</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-600 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/home')}
          className="mb-6 flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
        >
          <MdArrowBack className="text-xl" />
          <span>Back to Auctions</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{auction.name}</h1>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(auction.status)}`}>
              {auction.status.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-400">Auction Details & Management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Creator Info */}
            {auction.creator && (
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MdPerson className="text-cyan-400" />
                  Creator Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">Name</p>
                    <p className="font-semibold text-slate-200">{auction.creator.display_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-slate-300">{auction.creator.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdStar className="text-yellow-400" />
                    <span className="text-slate-300">Rating: {auction.creator.rating}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Auction Details */}
            <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MdAttachMoney className="text-cyan-400" />
                Auction Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Starting Price</p>
                  <p className="font-bold text-2xl text-cyan-400">{formatPrice(auction.starting_price)}</p>
                </div>
                {auction.min_increment && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Min Increment</p>
                    <p className="font-semibold text-lg text-slate-200">{formatPrice(auction.min_increment)}</p>
                  </div>
                )}
                {auction.reserve_price && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Reserve Price</p>
                    <p className="font-semibold text-lg text-slate-200">{formatPrice(auction.reserve_price)}</p>
                  </div>
                )}
                {auction.buy_now_price && (
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Buy Now Price</p>
                    <p className="font-semibold text-lg text-slate-200">{formatPrice(auction.buy_now_price)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-slate-400 mb-1">Currency</p>
                  <p className="font-semibold text-slate-200">{auction.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Visibility</p>
                  <p className="font-semibold text-slate-200 capitalize">{auction.visibility}</p>
                </div>
              </div>
            </div>

            {/* Time Information */}
            <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MdCalendarToday className="text-cyan-400" />
                Time Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Start Time</p>
                  <p className="text-slate-200">{formatDate(auction.start_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">End Time</p>
                  <p className="text-slate-200">{formatDate(auction.end_time)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Created At</p>
                  <p className="text-slate-200">{formatDate(auction.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Last Updated</p>
                  <p className="text-slate-200">{formatDate(auction.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Auction Items */}
            {auction.auction_items && auction.auction_items.length > 0 && (
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Auction Items</h2>
                <div className="space-y-4">
                  {auction.auction_items.map((item) => {
                    const product = auction.products?.find((p) => p.id === item.product_id)
                    return (
                      <div
                        key={item.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-200 text-lg mb-1">
                              {item.listing_title}
                            </p>
                            {product && (
                              <>
                                <p className="text-sm text-slate-400 mb-2">{product.name}</p>
                                {product.description && (
                                  <p className="text-sm text-slate-300">{product.description}</p>
                                )}
                                {product.condition && (
                                  <p className="text-xs text-slate-400 mt-1">
                                    Condition: <span className="capitalize">{product.condition}</span>
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded text-xs font-medium border ${
                              item.status === 'active'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/5">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Starting Price</p>
                            <p className="font-semibold text-cyan-400">{formatPrice(item.starting_price)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Current Price</p>
                            <p className="font-semibold text-cyan-400">{formatPrice(item.current_price)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Lot Number</p>
                            <p className="font-semibold text-slate-200">#{item.lot_number}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-600 transition-all">
                  Edit Auction
                </button>
                <button className="w-full px-4 py-3 bg-white/5 border border-white/8 text-slate-200 rounded-lg font-medium hover:bg-white/6 transition-all">
                  View Bids
                </button>
                <button className="w-full px-4 py-3 bg-white/5 border border-white/8 text-slate-200 rounded-lg font-medium hover:bg-white/6 transition-all">
                  Export Data
                </button>
              </div>
            </div>

            {/* Metadata */}
            {auction.metadata && Object.keys(auction.metadata).length > 0 && (
              <div className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
                <div className="space-y-2">
                  {Object.entries(auction.metadata).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-slate-400 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm text-slate-200">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuctionDetails

