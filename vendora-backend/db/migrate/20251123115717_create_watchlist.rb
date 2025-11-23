class CreateWatchlist < ActiveRecord::Migration[8.0]
  def change
    create_table :watchlist do |t|
      t.bigint :user_id, null: false
      t.bigint :auction_id
      t.bigint :auction_item_id

      t.timestamps
    end

    add_index :watchlist, :user_id
    add_index :watchlist, :auction_id
    add_index :watchlist, :auction_item_id
    add_index :watchlist, [:user_id, :auction_id, :auction_item_id], unique: true, name: 'idx_watchlist_unique'
    add_foreign_key :watchlist, :users, on_delete: :cascade
    add_foreign_key :watchlist, :auctions, on_delete: :cascade
    add_foreign_key :watchlist, :auction_items, on_delete: :cascade
  end
end
