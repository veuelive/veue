# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_09_11_155206) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "chat_messages", force: :cascade do |t|
    t.text "body"
    t.bigint "user_id", null: false
    t.bigint "video_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_chat_messages_on_user_id"
    t.index ["video_id"], name: "index_chat_messages_on_video_id"
  end

  create_table "mux_assets", force: :cascade do |t|
    t.string "mux_status"
    t.string "mux_id"
    t.string "mux_playback_id"
    t.bigint "video_id"
    t.float "duration"
    t.string "max_stored_resolution"
    t.float "max_stored_frame_rate"
    t.string "aspect_ratio"
    t.boolean "per_title_encode"
    t.boolean "is_live"
    t.datetime "latest_mux_webhook_at"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["mux_id"], name: "index_mux_assets_on_mux_id", unique: true
    t.index ["video_id"], name: "index_mux_assets_on_video_id"
  end

  create_table "mux_live_streams", force: :cascade do |t|
    t.bigint "user_id"
    t.string "mux_status"
    t.string "mux_id"
    t.string "stream_key"
    t.string "mux_playback_id"
    t.datetime "latest_mux_webhook_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["mux_id"], name: "index_mux_live_streams_on_mux_id", unique: true
    t.index ["user_id", "mux_status"], name: "index_mux_live_streams_on_user_id_and_mux_status"
  end

  create_table "mux_webhooks", force: :cascade do |t|
    t.string "mux_target_type"
    t.bigint "mux_target_id"
    t.string "type"
    t.string "event"
    t.string "mux_id"
    t.datetime "event_received_at"
    t.datetime "finished_processing_at"
    t.string "mux_environment"
    t.string "mux_request_id"
    t.json "payload"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["mux_id"], name: "index_mux_webhooks_on_mux_id", unique: true
    t.index ["mux_target_type", "mux_target_id"], name: "index_mux_webhooks_on_mux_target_type_and_mux_target_id"
  end

  create_table "user_login_attempts", force: :cascade do |t|
    t.text "phone_number_ciphertext"
    t.string "phone_number_bidx"
    t.bigint "user_id"
    t.text "secret_code_ciphertext"
    t.text "ula_uuid_ciphertext"
    t.string "ula_uuid_bidx"
    t.string "state"
    t.inet "ip_address"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ip_address"], name: "index_user_login_attempts_on_ip_address"
    t.index ["phone_number_bidx"], name: "index_user_login_attempts_on_phone_number_bidx"
    t.index ["state"], name: "index_user_login_attempts_on_state"
    t.index ["ula_uuid_bidx"], name: "index_user_login_attempts_on_ula_uuid_bidx"
    t.index ["user_id"], name: "index_user_login_attempts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.bigint "mux_live_stream_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "phone_number_ciphertext", null: false
    t.string "phone_number_bidx"
    t.string "phone_number_country", limit: 3
    t.string "display_name"
    t.string "state"
    t.string "username"
    t.index ["mux_live_stream_id"], name: "index_users_on_mux_live_stream_id"
  end

  create_table "videos", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "slug"
    t.string "title"
    t.string "mux_playback_id"
    t.string "state"
    t.bigint "mux_live_stream_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.text "description"
    t.index ["mux_live_stream_id"], name: "index_videos_on_mux_live_stream_id"
    t.index ["slug"], name: "index_videos_on_slug", unique: true
    t.index ["state"], name: "index_videos_on_state"
    t.index ["user_id"], name: "index_videos_on_user_id"
  end

  add_foreign_key "chat_messages", "users"
  add_foreign_key "chat_messages", "videos"
  add_foreign_key "mux_assets", "videos"
  add_foreign_key "videos", "users"
end
