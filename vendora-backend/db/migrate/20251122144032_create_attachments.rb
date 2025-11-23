class CreateAttachments < ActiveRecord::Migration[8.0]
  def up
    create_table :attachments, id: :bigserial do |t|
      t.references :submission, null: true, foreign_key: { on_delete: :cascade }, type: :bigint
      t.references :answer, null: true, foreign_key: { on_delete: :cascade }, type: :bigint
      t.text :file_url, null: false
      t.text :file_name
      t.bigint :file_size
      t.text :mime_type
      t.bigint :uploaded_by
      t.datetime :created_at, null: false, default: -> { 'now()' }
    end
  end

  def down
    drop_table :attachments
  end
end
