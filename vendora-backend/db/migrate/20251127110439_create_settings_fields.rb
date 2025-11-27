class CreateSettingsFields < ActiveRecord::Migration[8.0]
  def change
    create_table :settings_fields do |t|
      t.references :settings_section, null: false, foreign_key: { on_delete: :cascade }, type: :bigint
      t.text :field_key, null: false # The key used in preferences JSONB
      t.text :field_type, null: false # text, email, tel, date, select, toggle, textarea
      t.text :label, null: false
      t.text :hint # Optional hint text
      t.text :placeholder # Optional placeholder text
      t.jsonb :options, default: [] # For select fields: [{value: "x", label: "Y"}]
      t.text :default_value # Default value for the field
      t.integer :order, default: 0, null: false
      t.boolean :required, default: false
      t.boolean :is_active, default: true, null: false
      t.text :group_label # Optional group label to group fields together
      t.timestamps
    end

    # Note: t.references already creates an index on settings_section_id
    add_index :settings_fields, :field_key, name: "index_settings_fields_on_field_key"
    add_index :settings_fields, [:settings_section_id, :order], name: "index_settings_fields_on_section_and_order"
    add_index :settings_fields, :is_active, name: "index_settings_fields_on_is_active"
  end
end
