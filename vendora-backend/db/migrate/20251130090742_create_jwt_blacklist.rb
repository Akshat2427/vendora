class CreateJwtBlacklist < ActiveRecord::Migration[8.0]
  def change
    create_table :jwt_blacklists do |t|
      t.string :jti
      t.datetime :expires_at

      t.timestamps
    end
    add_index :jwt_blacklists, :jti
  end
end
