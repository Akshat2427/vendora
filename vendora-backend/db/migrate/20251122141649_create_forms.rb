class CreateForms < ActiveRecord::Migration[8.0]
  def up
    create_table :forms do |t|
      t.text :slug, null: false
      t.text :title, null: false
      t.text :description
      t.text :tags, array: true, default: []
      t.timestamps
    end

    add_index :forms, :slug, unique: true
    add_index :forms, :tags, using: :gin
  end

  def down
    drop_table :forms
  end
end
