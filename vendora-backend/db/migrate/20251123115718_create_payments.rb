class CreatePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :payments do |t|
      t.text :submission_id
      t.bigint :auction_item_id
      t.bigint :buyer_id
      t.bigint :seller_id
      t.decimal :amount, precision: 18, scale: 2
      t.string :currency, limit: 3, default: 'INR'
      t.text :status
      t.jsonb :transaction_meta

      t.timestamps
    end

    add_index :payments, :auction_item_id
    add_index :payments, :buyer_id
    add_index :payments, :seller_id
    add_index :payments, :status
    add_foreign_key :payments, :auction_items
    add_foreign_key :payments, :users, column: :buyer_id
    add_foreign_key :payments, :users, column: :seller_id
  end
end
