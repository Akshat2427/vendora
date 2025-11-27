import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuctionById } from '../store/slices/auctionSlice'
import { setUser } from '../store/slices/userSlice'
import usersData from '../data/users.json'

function Home() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const { auctions, loading, error } = useSelector((state) => state.auctions)

  // User initialization is now handled in App.jsx

  // Fetch auctions based on user role
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'seller') {
        // Seller sees their auction (ID: 3)
        dispatch(fetchAuctionById(3))
      } else if (currentUser.role === 'buyer') {
        // Buyer sees auctions they can participate in (ID: 2)
        dispatch(fetchAuctionById(2))
      }
    }
  }, [currentUser, dispatch])

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
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading auctions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="w-full mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentUser?.role === 'seller' ? 'My Auctions' : 'Available Auctions'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {currentUser?.role === 'seller'
                ? 'Manage and track your auction listings'
                : 'Browse and participate in live auctions'}
            </p>
          </div>
          {currentUser?.role === 'seller' && (
            <button
              onClick={() => navigate('/auction-create')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-xl hover:from-indigo-700 hover:to-cyan-600 transition-all flex items-center gap-2 font-medium"
            >
              <span className="text-xl">+</span>
              Auction
            </button>
          )}
        </div>

        {/* User Switcher (for testing) - Moved above cards */}
        <div className="mb-6 p-4 bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl">
          <p className="text-sm font-semibold text-slate-300 mb-3">Switch User (Testing)</p>
          <div className="flex flex-wrap gap-2">
            {usersData.map((user) => (
              <button
                key={user.id}
                onClick={() => dispatch(setUser(user))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentUser?.id === user.id
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white'
                    : 'bg-white/6 text-slate-300 hover:bg-white/8'
                }`}
              >
                {user.display_name} ({user.role})
              </button>
            ))}
          </div>
        </div>

        {/* Auction Cards - Horizontal Layout */}
        {auctions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No auctions available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white/6 backdrop-blur-sm rounded-xl border border-white/6 shadow-xl overflow-hidden hover:bg-white/8 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Left Section - Auction Header & Main Info */}
                  <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-white/6">
                    {/* Auction Header */}
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-slate-100">{auction.name}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          auction.status
                        )}`}
                      >
                        {auction.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Creator Info */}
                    {auction.creator && (
                      <div className="mb-4 pb-4 border-b border-white/6">
                        <p className="text-xs text-slate-400 mb-1">Created by</p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-200">{auction.creator.display_name}</p>
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-slate-300 ml-1">
                              {auction.creator.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Auction Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Starting Price</p>
                        <p className="font-bold text-xl text-cyan-400">
                          {formatPrice(auction.starting_price)}
                        </p>
                      </div>
                      {auction.min_increment && (
                        <div>
                          <p className="text-xs text-slate-400 mb-1">Min Increment</p>
                          <p className="font-semibold text-lg text-slate-200">
                            {formatPrice(auction.min_increment)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Time Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Start Time</p>
                        <p className="text-sm font-medium text-slate-300">
                          {formatDate(auction.start_time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">End Time</p>
                        <p className="text-sm font-medium text-slate-300">
                          {formatDate(auction.end_time)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Auction Items */}
                  <div className="flex-1 p-6">
                    {auction.auction_items && auction.auction_items.length > 0 ? (
                      <>
                        <p className="text-sm font-semibold text-slate-300 mb-3">Auction Items</p>
                        <div className="space-y-3">
                          {auction.auction_items.map((item) => {
                            const product = auction.products?.find((p) => p.id === item.product_id)
                            return (
                              <div
                                key={item.id}
                                className="bg-white/5 rounded-lg p-4 border border-white/5"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-200 text-sm mb-1">
                                      {item.listing_title}
                                    </p>
                                    {product && (
                                      <p className="text-xs text-slate-400 mb-2">{product.name}</p>
                                    )}
                                    <div className="flex items-center gap-4">
                                      <div>
                                        <p className="text-xs text-slate-400">Current Price</p>
                                        <p className="font-semibold text-cyan-400">
                                          {formatPrice(item.current_price)}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-slate-400">Lot #</p>
                                        <p className="font-medium text-slate-300">{item.lot_number}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-medium border ${
                                      item.status === 'active'
                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                        : 'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400 text-sm">No items in this auction</p>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          if (currentUser?.role === 'seller') {
                            navigate(`/auction/${auction.id}/details`)
                          } else {
                            navigate(`/auction/${auction.id}/bid`)
                          }
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-600 transition-all"
                      >
                        {currentUser?.role === 'seller' ? 'View Details' : 'Place Bid'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
