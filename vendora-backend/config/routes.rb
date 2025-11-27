Rails.application.routes.draw do
  resources :users, only: [ :index, :create ]
  resources :forms
  resources :submissions
  resources :auctions do
    collection do
      post 'create_with_products', to: 'auctions#create_with_products'
    end
  end
  resources :bids, only: [:create]
  post 'ai_chat/chat', to: 'ai_chat#chat'
  get 'feedback', to: 'feedback#index'
  post 'feedback/submit', to: 'feedback#submit'
  resources :notifications, only: [:index, :show] do
    member do
      post 'mark_seen', to: 'notifications#mark_seen'
    end
    collection do
      post 'mark_all_seen', to: 'notifications#mark_all_seen'
    end
  end
  resources :faqs, only: [:index, :show]
  get 'settings/:user_id', to: 'settings#show'
  put 'settings/:user_id', to: 'settings#update'
  patch 'settings/:user_id', to: 'settings#update'
  resources :settings_sections, only: [:index, :show]
  get "hello_world", to: "hello_world#index"

  # Analytics routes
  get "analytics/kpis", to: "analytics#kpis"
  get "analytics/bids_over_time", to: "analytics#bids_over_time"
  get "analytics/top_products", to: "analytics#top_products"
  get "analytics/all_products", to: "analytics#all_products"
  get "analytics/product_count", to: "analytics#product_count"
  get "analytics/market_trends", to: "analytics#market_trends"
  get "analytics/top_auctions", to: "analytics#top_auctions"
  get "analytics/recent_bids", to: "analytics#recent_bids"
  get "analytics/auction_table", to: "analytics#auction_table"

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
