class CreateProductImages < ActiveRecord::Migration[8.0]
  def change
    create_table :product_images do |t|
      t.bigint :product_id, null: false
      t.text :url, null: false
      t.text :alt_text
      t.integer :sort_order, default: 0

      t.timestamps
    end

    add_index :product_images, :product_id
    add_foreign_key :product_images, :products, on_delete: :cascade
  end
end
