class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.bigint :seller_id
      t.text :name, null: false
      t.text :description
      t.integer :category_id
      t.text :sku
      t.text :condition
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :products, :seller_id
    add_index :products, :category_id
    add_index :products, :sku
    add_foreign_key :products, :users, column: :seller_id, on_delete: :nullify
    add_foreign_key :products, :categories, column: :category_id
  end
end
