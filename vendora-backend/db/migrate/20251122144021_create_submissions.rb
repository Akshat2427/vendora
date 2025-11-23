class CreateSubmissions < ActiveRecord::Migration[8.0]
  def up
    create_table :submissions, id: :bigserial do |t|
      t.references :form, null: false, foreign_key: { on_delete: :cascade }, type: :integer
      t.bigint :user_id, null: true
      t.text :submitter_type, default: 'user'
      t.text :status, null: false, default: 'completed'
      t.integer :question_version, null: true
      t.jsonb :meta, default: {}
      t.timestamps
    end

    add_index :submissions, :form_id, name: 'idx_submissions_form'
    add_index :submissions, :user_id, name: 'idx_submissions_user'
  end

  def down
    drop_table :submissions
  end
end
