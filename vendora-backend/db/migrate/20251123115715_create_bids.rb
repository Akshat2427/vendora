class CreateBids < ActiveRecord::Migration[8.0]
  def change
    create_table :bids do |t|
      t.bigint :auction_item_id, null: false
      t.bigint :user_id
      t.decimal :amount, precision: 18, scale: 2, null: false
      t.boolean :is_auto, default: false
      t.decimal :auto_max, precision: 18, scale: 2

      t.timestamps
    end

    add_index :bids, [:auction_item_id, :amount], order: { amount: :desc }, name: 'idx_bids_item_amount'
    add_index :bids, :user_id
    add_foreign_key :bids, :auction_items, on_delete: :cascade
    add_foreign_key :bids, :users, on_delete: :nullify
  end
end
