class CreateAnswers < ActiveRecord::Migration[8.0]
  def up
    create_table :answers, id: :bigserial do |t|
      t.references :submission, null: false, foreign_key: { on_delete: :cascade }, type: :bigint
      t.references :question, null: false, foreign_key: { on_delete: :restrict }, type: :bigint
      t.bigint :option_id, null: true
      t.jsonb :value, null: true
      t.boolean :is_confidential, default: false
      t.timestamps
    end

    add_index :answers, :submission_id, name: 'idx_answers_submission'
    add_index :answers, :question_id, name: 'idx_answers_question'
    add_index :answers, [:submission_id, :question_id], unique: true
  end

  def down
    drop_table :answers
  end
end
