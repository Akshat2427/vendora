class CreateOptions < ActiveRecord::Migration[8.0]
  def up
    create_table :options, id: :bigserial do |t|
      t.references :question, null: false, foreign_key: { on_delete: :cascade }, type: :bigint
      t.text :text, null: false
      t.text :value
      t.boolean :is_correct, default: false
      t.integer :order, default: 0
    end

    add_index :options, :question_id, name: 'idx_options_question_id'
  end

  def down
    drop_table :options
  end
end
