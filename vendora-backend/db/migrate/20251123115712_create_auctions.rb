class CreateAuctions < ActiveRecord::Migration[8.0]
  def change
    create_table :auctions do |t|
      t.text :name, null: false
      t.bigint :created_by
      t.text :visibility, default: 'public'
      t.timestamp :start_time, null: false
      t.timestamp :end_time, null: false
      t.text :status, null: false, default: 'scheduled'
      t.string :currency, limit: 3, default: 'INR'
      t.decimal :reserve_price, precision: 18, scale: 2
      t.decimal :starting_price, precision: 18, scale: 2
      t.decimal :min_increment, precision: 18, scale: 2, default: 1.00
      t.decimal :buy_now_price, precision: 18, scale: 2
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :auctions, :created_by
    add_index :auctions, [:status, :start_time, :end_time], name: 'idx_auctions_time_status'
    add_foreign_key :auctions, :users, column: :created_by, on_delete: :nullify
  end
end
