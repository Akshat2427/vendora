class CreateCategories < ActiveRecord::Migration[8.0]
  def change
    create_table :categories do |t|
      t.text :name, null: false
      t.text :slug
      t.integer :parent_id
      t.text :path
      t.jsonb :meta, default: {}

      t.timestamps
    end

    add_index :categories, :slug, unique: true
    add_index :categories, :parent_id
    add_foreign_key :categories, :categories, column: :parent_id, on_delete: :nullify
  end
end
