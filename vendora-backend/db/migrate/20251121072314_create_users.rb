class CreateUsers < ActiveRecord::Migration[8.0]
  def up
    create_table :users do |t|
      t.string :name, null: false
      t.string :email, null: false
      t.string :phone
      t.string :prefix
      t.string :address
      t.integer :status, default: 0, null: false
      t.jsonb :metadata, default: {}

      t.timestamps
    end

    add_index :users, :email, unique: true
  end

  def down
    drop_table :users
  end
end
