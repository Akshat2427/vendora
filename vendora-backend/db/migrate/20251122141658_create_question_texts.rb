class CreateQuestionTexts < ActiveRecord::Migration[8.0]
  def up
    create_table :question_texts, id: :bigserial do |t|
      t.references :question, null: false, foreign_key: { on_delete: :cascade }, type: :bigint
      t.string :locale, limit: 10, default: 'en'
      t.text :text, null: false
      t.text :help_text
      t.timestamps
    end

    add_index :question_texts, [:question_id, :locale], unique: true
  end

  def down
    drop_table :question_texts
  end
end
