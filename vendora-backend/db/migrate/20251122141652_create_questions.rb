class CreateQuestions < ActiveRecord::Migration[8.0]
  def up
    create_table :questions, id: :bigserial do |t|
      t.references :form, null: true, foreign_key: { on_delete: :nullify }
      t.text :key
      t.text :type, null: false
      t.boolean :required, default: false
      t.integer :order, default: 0
      t.integer :difficulty, limit: 2
      t.boolean :is_active, default: true
      t.integer :created_by
      t.text :tag, array: true, default: []
      t.timestamps
    end

    add_index :questions, [:form_id, :order], name: 'idx_questions_form_order'
    add_index :questions, :is_active, name: 'idx_questions_active'
    add_index :questions, :tag, using: :gin, name: 'idx_questions_tag'
  end

  def down
    drop_table :questions
  end
end
