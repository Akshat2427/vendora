class CreateSettingsSections < ActiveRecord::Migration[8.0]
  def change
    create_table :settings_sections do |t|
      t.text :key, null: false # account, security, notifications, etc.
      t.text :label, null: false # "Account Settings", "Security & Login", etc.
      t.text :icon, null: false # Icon component name like "MdAccountCircle"
      t.integer :order, default: 0, null: false
      t.boolean :is_active, default: true, null: false
      t.timestamps
    end

    add_index :settings_sections, :key, unique: true
    add_index :settings_sections, :order
    add_index :settings_sections, :is_active
  end
end
