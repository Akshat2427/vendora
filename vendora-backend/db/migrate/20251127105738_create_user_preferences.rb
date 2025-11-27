class CreateUserPreferences < ActiveRecord::Migration[8.0]
  def change
    create_table :user_preferences do |t|
      t.bigint :user_id, null: false
      t.jsonb :preferences, default: {}, null: false
      t.timestamps
    end

    add_index :user_preferences, :user_id, unique: true
    add_foreign_key :user_preferences, :users, on_delete: :cascade
  end
end
