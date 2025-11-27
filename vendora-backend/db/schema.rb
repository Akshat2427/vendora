# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_11_27_110439) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "answers", force: :cascade do |t|
    t.bigint "submission_id", null: false
    t.bigint "question_id", null: false
    t.bigint "option_id"
    t.jsonb "value"
    t.boolean "is_confidential", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "idx_answers_question"
    t.index ["question_id"], name: "index_answers_on_question_id"
    t.index ["submission_id", "question_id"], name: "index_answers_on_submission_id_and_question_id", unique: true
    t.index ["submission_id"], name: "idx_answers_submission"
    t.index ["submission_id"], name: "index_answers_on_submission_id"
  end

  create_table "attachments", force: :cascade do |t|
    t.bigint "submission_id"
    t.bigint "answer_id"
    t.text "file_url", null: false
    t.text "file_name"
    t.bigint "file_size"
    t.text "mime_type"
    t.bigint "uploaded_by"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.index ["answer_id"], name: "index_attachments_on_answer_id"
    t.index ["submission_id"], name: "index_attachments_on_submission_id"
  end

  create_table "auction_items", force: :cascade do |t|
    t.bigint "auction_id", null: false
    t.bigint "product_id", null: false
    t.text "listing_title"
    t.decimal "starting_price", precision: 18, scale: 2
    t.decimal "current_price", precision: 18, scale: 2
    t.decimal "reserve_price", precision: 18, scale: 2
    t.text "status", default: "active"
    t.integer "lot_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auction_id", "product_id"], name: "index_auction_items_on_auction_id_and_product_id", unique: true
    t.index ["auction_id", "status", "lot_number"], name: "idx_auction_items_auction"
    t.index ["product_id"], name: "index_auction_items_on_product_id"
  end

  create_table "auctions", force: :cascade do |t|
    t.text "name", null: false
    t.bigint "created_by"
    t.text "visibility", default: "public"
    t.datetime "start_time", precision: nil, null: false
    t.datetime "end_time", precision: nil, null: false
    t.text "status", default: "scheduled", null: false
    t.string "currency", limit: 3, default: "INR"
    t.decimal "reserve_price", precision: 18, scale: 2
    t.decimal "starting_price", precision: 18, scale: 2
    t.decimal "min_increment", precision: 18, scale: 2, default: "1.0"
    t.decimal "buy_now_price", precision: 18, scale: 2
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by"], name: "index_auctions_on_created_by"
    t.index ["status", "start_time", "end_time"], name: "idx_auctions_time_status"
  end

  create_table "bids", force: :cascade do |t|
    t.bigint "auction_item_id", null: false
    t.bigint "user_id"
    t.decimal "amount", precision: 18, scale: 2, null: false
    t.boolean "is_auto", default: false
    t.decimal "auto_max", precision: 18, scale: 2
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["auction_item_id", "amount"], name: "idx_bids_item_amount", order: { amount: :desc }
    t.index ["user_id"], name: "index_bids_on_user_id"
  end

  create_table "categories", force: :cascade do |t|
    t.text "name", null: false
    t.text "slug"
    t.integer "parent_id"
    t.text "path"
    t.jsonb "meta", default: {}
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["parent_id"], name: "index_categories_on_parent_id"
    t.index ["slug"], name: "index_categories_on_slug", unique: true
  end

  create_table "faqs", force: :cascade do |t|
    t.text "category", null: false
    t.text "question", null: false
    t.text "answer", null: false
    t.integer "order", default: 0, null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category", "order"], name: "index_faqs_on_category_and_order"
    t.index ["category"], name: "index_faqs_on_category"
    t.index ["is_active"], name: "index_faqs_on_is_active"
  end

  create_table "forms", force: :cascade do |t|
    t.text "slug", null: false
    t.text "title", null: false
    t.text "description"
    t.text "tags", default: [], array: true
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["slug"], name: "index_forms_on_slug", unique: true
    t.index ["tags"], name: "index_forms_on_tags", using: :gin
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "title", null: false
    t.text "message", null: false
    t.text "notification_type", null: false
    t.boolean "seen", default: false, null: false
    t.text "deeplink"
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["notification_type"], name: "index_notifications_on_notification_type"
    t.index ["seen"], name: "index_notifications_on_seen"
    t.index ["user_id", "seen"], name: "index_notifications_on_user_id_and_seen"
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "options", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.text "text", null: false
    t.text "value"
    t.boolean "is_correct", default: false
    t.integer "order", default: 0
    t.index ["question_id"], name: "idx_options_question_id"
    t.index ["question_id"], name: "index_options_on_question_id"
  end

  create_table "payments", force: :cascade do |t|
    t.text "submission_id"
    t.bigint "auction_item_id"
    t.bigint "buyer_id"
    t.bigint "seller_id"
    t.decimal "amount", precision: 18, scale: 2
    t.string "currency", limit: 3, default: "INR"
    t.text "status"
    t.jsonb "transaction_meta"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["auction_item_id"], name: "index_payments_on_auction_item_id"
    t.index ["buyer_id"], name: "index_payments_on_buyer_id"
    t.index ["seller_id"], name: "index_payments_on_seller_id"
    t.index ["status"], name: "index_payments_on_status"
  end

  create_table "product_images", force: :cascade do |t|
    t.bigint "product_id", null: false
    t.text "url", null: false
    t.text "alt_text"
    t.integer "sort_order", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_product_images_on_product_id"
  end

  create_table "products", force: :cascade do |t|
    t.bigint "seller_id"
    t.text "name", null: false
    t.text "description"
    t.integer "category_id"
    t.text "sku"
    t.text "condition"
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["seller_id"], name: "index_products_on_seller_id"
    t.index ["sku"], name: "index_products_on_sku"
  end

  create_table "question_texts", force: :cascade do |t|
    t.bigint "question_id", null: false
    t.string "locale", limit: 10, default: "en"
    t.text "text", null: false
    t.text "help_text"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["question_id", "locale"], name: "index_question_texts_on_question_id_and_locale", unique: true
    t.index ["question_id"], name: "index_question_texts_on_question_id"
  end

  create_table "questions", force: :cascade do |t|
    t.bigint "form_id"
    t.text "key"
    t.text "type", null: false
    t.boolean "required", default: false
    t.integer "order", default: 0
    t.integer "difficulty", limit: 2
    t.boolean "is_active", default: true
    t.integer "created_by"
    t.text "tag", default: [], array: true
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["form_id", "order"], name: "idx_questions_form_order"
    t.index ["form_id"], name: "index_questions_on_form_id"
    t.index ["is_active"], name: "idx_questions_active"
    t.index ["tag"], name: "idx_questions_tag", using: :gin
  end

  create_table "settings_fields", force: :cascade do |t|
    t.bigint "settings_section_id", null: false
    t.text "field_key", null: false
    t.text "field_type", null: false
    t.text "label", null: false
    t.text "hint"
    t.text "placeholder"
    t.jsonb "options", default: []
    t.text "default_value"
    t.integer "order", default: 0, null: false
    t.boolean "required", default: false
    t.boolean "is_active", default: true, null: false
    t.text "group_label"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["field_key"], name: "index_settings_fields_on_field_key"
    t.index ["is_active"], name: "index_settings_fields_on_is_active"
    t.index ["settings_section_id", "order"], name: "index_settings_fields_on_section_and_order"
    t.index ["settings_section_id"], name: "index_settings_fields_on_settings_section_id"
  end

  create_table "settings_sections", force: :cascade do |t|
    t.text "key", null: false
    t.text "label", null: false
    t.text "icon", null: false
    t.integer "order", default: 0, null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["is_active"], name: "index_settings_sections_on_is_active"
    t.index ["key"], name: "index_settings_sections_on_key", unique: true
    t.index ["order"], name: "index_settings_sections_on_order"
  end

  create_table "submissions", force: :cascade do |t|
    t.integer "form_id", null: false
    t.bigint "user_id"
    t.text "submitter_type", default: "user"
    t.text "status", default: "completed", null: false
    t.integer "question_version"
    t.jsonb "meta", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["form_id"], name: "idx_submissions_form"
    t.index ["form_id"], name: "index_submissions_on_form_id"
    t.index ["user_id"], name: "idx_submissions_user"
  end

  create_table "user_preferences", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.jsonb "preferences", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_preferences_on_user_id", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "phone"
    t.string "prefix"
    t.string "address"
    t.integer "status", default: 0, null: false
    t.jsonb "metadata", default: {}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "username"
    t.text "display_name"
    t.text "role", default: "buyer"
    t.decimal "rating", precision: 3, scale: 2, default: "0.0"
    t.date "date_of_birth"
    t.text "profile_photo_url"
    t.text "billing_address"
    t.text "shipping_address"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "watchlist", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "auction_id"
    t.bigint "auction_item_id"
    t.datetime "created_at", default: -> { "now()" }, null: false
    t.datetime "updated_at", default: -> { "now()" }, null: false
    t.index ["auction_id"], name: "index_watchlist_on_auction_id"
    t.index ["auction_item_id"], name: "index_watchlist_on_auction_item_id"
    t.index ["user_id", "auction_id", "auction_item_id"], name: "idx_watchlist_unique", unique: true
    t.index ["user_id"], name: "index_watchlist_on_user_id"
  end

  add_foreign_key "answers", "questions", on_delete: :restrict
  add_foreign_key "answers", "submissions", on_delete: :cascade
  add_foreign_key "attachments", "answers", on_delete: :cascade
  add_foreign_key "attachments", "submissions", on_delete: :cascade
  add_foreign_key "auction_items", "auctions", on_delete: :cascade
  add_foreign_key "auction_items", "products", on_delete: :cascade
  add_foreign_key "auctions", "users", column: "created_by", on_delete: :nullify
  add_foreign_key "bids", "auction_items", on_delete: :cascade
  add_foreign_key "bids", "users", on_delete: :nullify
  add_foreign_key "categories", "categories", column: "parent_id", on_delete: :nullify
  add_foreign_key "notifications", "users", on_delete: :cascade
  add_foreign_key "options", "questions", on_delete: :cascade
  add_foreign_key "payments", "auction_items"
  add_foreign_key "payments", "users", column: "buyer_id"
  add_foreign_key "payments", "users", column: "seller_id"
  add_foreign_key "product_images", "products", on_delete: :cascade
  add_foreign_key "products", "categories"
  add_foreign_key "products", "users", column: "seller_id", on_delete: :nullify
  add_foreign_key "question_texts", "questions", on_delete: :cascade
  add_foreign_key "questions", "forms", on_delete: :nullify
  add_foreign_key "settings_fields", "settings_sections", on_delete: :cascade
  add_foreign_key "submissions", "forms", on_delete: :cascade
  add_foreign_key "user_preferences", "users", on_delete: :cascade
  add_foreign_key "watchlist", "auction_items", on_delete: :cascade
  add_foreign_key "watchlist", "auctions", on_delete: :cascade
  add_foreign_key "watchlist", "users", on_delete: :cascade
end
