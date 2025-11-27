class CreateNotifications < ActiveRecord::Migration[8.0]
  def change
    create_table :notifications do |t|
      t.bigint :user_id, null: false
      t.text :title, null: false
      t.text :message, null: false
      t.text :notification_type, null: false # bid_placed, feedback_submitted, auction_created, etc.
      t.boolean :seen, default: false, null: false
      t.text :deeplink # URL or route to navigate to
      t.jsonb :metadata, default: {}
      t.datetime :created_at, null: false
      t.datetime :updated_at, null: false
    end

    add_index :notifications, :user_id
    add_index :notifications, :seen
    add_index :notifications, :notification_type
    add_index :notifications, [:user_id, :seen]
    add_foreign_key :notifications, :users, on_delete: :cascade
  end
end
