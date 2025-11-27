class AddSettingsFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :date_of_birth, :date
    add_column :users, :profile_photo_url, :text
    add_column :users, :billing_address, :text
    add_column :users, :shipping_address, :text
  end
end
