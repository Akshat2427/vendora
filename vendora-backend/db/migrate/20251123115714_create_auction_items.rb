class CreateAuctionItems < ActiveRecord::Migration[8.0]
  def change
    create_table :auction_items do |t|
      t.bigint :auction_id, null: false
      t.bigint :product_id, null: false
      t.text :listing_title
      t.decimal :starting_price, precision: 18, scale: 2
      t.decimal :current_price, precision: 18, scale: 2
      t.decimal :reserve_price, precision: 18, scale: 2
      t.text :status, default: 'active'
      t.integer :lot_number

      t.timestamps
    end

    add_index :auction_items, [:auction_id, :status, :lot_number], name: 'idx_auction_items_auction'
    add_index :auction_items, :product_id
    add_index :auction_items, [:auction_id, :product_id], unique: true
    add_foreign_key :auction_items, :auctions, on_delete: :cascade
    add_foreign_key :auction_items, :products, on_delete: :cascade
  end
end
