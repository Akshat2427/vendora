class CreateFaqs < ActiveRecord::Migration[8.0]
  def change
    create_table :faqs do |t|
      t.text :category, null: false # getting-started, bidding, selling, account, payments
      t.text :question, null: false
      t.text :answer, null: false
      t.integer :order, default: 0, null: false
      t.boolean :is_active, default: true, null: false
      t.timestamps
    end

    add_index :faqs, :category
    add_index :faqs, :is_active
    add_index :faqs, [:category, :order]
  end
end
