class AddAuctionFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    unless column_exists?(:users, :username)
      add_column :users, :username, :text
    end
    
    unless column_exists?(:users, :display_name)
      add_column :users, :display_name, :text
    end
    
    unless column_exists?(:users, :role)
      add_column :users, :role, :text, default: 'buyer'
    end
    
    unless column_exists?(:users, :rating)
      add_column :users, :rating, :decimal, precision: 3, scale: 2, default: 0
    end
    
    unless index_exists?(:users, :username)
      add_index :users, :username, unique: true
    end
  end
end
