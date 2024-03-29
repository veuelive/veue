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

ActiveRecord::Schema.define(version: 2021_05_18_092240) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "uuid-ossp"

  # These are custom enum types that must be created before they can be used in the schema definition
  create_enum "sms_status_setting", ["new_number", "instructions_sent", "unsubscribed"]
  create_enum "user_type_enum", ["normal", "employee", "admin"]
  create_enum "visibility_setting", ["public", "protected", "private"]

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.uuid "category_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["category_id"], name: "index_categories_on_category_id"
  end

  create_table "channels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "mux_live_stream_id"
    t.text "mux_stream_key_ciphertext"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "followers_count", default: 0
    t.boolean "verified", default: false
    t.uuid "legacy_user_id"
    t.text "description"
    t.json "schedule", default: {}
    t.datetime "next_show_at"
    t.string "tagline", limit: 70
    t.index ["legacy_user_id"], name: "index_channels_on_legacy_user_id"
    t.index ["mux_live_stream_id"], name: "index_channels_on_mux_live_stream_id", unique: true
    t.index ["name"], name: "index_channels_on_name", unique: true
    t.index ["slug"], name: "index_channels_on_slug", unique: true
    t.index ["verified"], name: "index_channels_on_verified"
  end

  create_table "follows", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.datetime "unfollowed_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "channel_id"
    t.index ["channel_id"], name: "index_follows_on_channel_id"
    t.index ["user_id", "channel_id", "unfollowed_at"], name: "index_follows_on_user_id_and_channel_id_and_unfollowed_at", unique: true
  end

  create_table "hosts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "channel_id"
    t.uuid "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["channel_id"], name: "index_hosts_on_channel_id"
    t.index ["user_id", "channel_id"], name: "index_hosts_on_user_id_and_channel_id"
    t.index ["user_id"], name: "index_hosts_on_user_id"
  end

  create_table "moderation_items", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "text"
    t.jsonb "scores"
    t.float "summary_score"
    t.string "state"
    t.integer "processing_time"
    t.uuid "video_event_id"
    t.uuid "user_id"
    t.uuid "video_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_moderation_items_on_user_id"
    t.index ["video_event_id"], name: "index_moderation_items_on_video_event_id"
    t.index ["video_id"], name: "index_moderation_items_on_video_id"
  end

  create_table "mux_webhooks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "mux_id"
    t.datetime "event_received_at"
    t.datetime "finished_processing_at"
    t.string "mux_environment"
    t.string "mux_request_id"
    t.json "payload"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.uuid "video_id"
    t.string "event_type"
    t.uuid "channel_id"
    t.index ["channel_id"], name: "index_mux_webhooks_on_channel_id"
    t.index ["mux_id"], name: "index_mux_webhooks_on_mux_id", unique: true
    t.index ["user_id"], name: "index_mux_webhooks_on_user_id"
    t.index ["video_id"], name: "index_mux_webhooks_on_video_id"
  end

  create_table "pins", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "url"
    t.string "name"
    t.bigint "timecode_ms"
    t.uuid "video_id"
    t.uuid "pin_event_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["pin_event_id"], name: "index_pins_on_pin_event_id"
  end

  create_table "session_tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "uuid", null: false
    t.text "phone_number_ciphertext"
    t.string "phone_number_bidx"
    t.uuid "user_id"
    t.text "secret_code_ciphertext"
    t.string "state"
    t.inet "ip_address"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ip_address"], name: "index_session_tokens_on_ip_address"
    t.index ["phone_number_bidx"], name: "index_session_tokens_on_phone_number_bidx"
    t.index ["state"], name: "index_session_tokens_on_state"
    t.index ["user_id"], name: "index_session_tokens_on_user_id"
    t.index ["uuid"], name: "index_session_tokens_on_uuid"
  end

  create_table "sms_messages", force: :cascade do |t|
    t.uuid "session_token_id"
    t.text "text_ciphertext"
    t.string "from"
    t.text "to_ciphertext"
    t.string "to_bidx"
    t.integer "price_in_cents"
    t.string "service"
    t.string "status"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["service"], name: "index_sms_messages_on_service"
    t.index ["session_token_id"], name: "index_sms_messages_on_session_token_id"
    t.index ["status"], name: "index_sms_messages_on_status"
    t.index ["to_bidx"], name: "index_sms_messages_on_to_bidx"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.integer "failed_attempts", default: 0, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "phone_number_ciphertext", null: false
    t.string "phone_number_bidx"
    t.string "display_name"
    t.string "mux_live_stream_id"
    t.text "mux_stream_key_ciphertext"
    t.enum "sms_status", default: "new_number", as: "sms_status_setting"
    t.text "about_me"
    t.string "email"
    t.boolean "verified", default: false
    t.text "email_ciphertext"
    t.string "email_bidx"
    t.enum "user_type", default: "normal", as: "user_type_enum"
    t.index ["email_bidx"], name: "index_users_on_email_bidx"
    t.index ["mux_live_stream_id"], name: "index_users_on_mux_live_stream_id"
    t.index ["verified"], name: "index_users_on_verified"
  end

  create_table "video_categories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "category_id"
    t.uuid "video_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["category_id"], name: "index_video_categories_on_category_id"
    t.index ["video_id"], name: "index_video_categories_on_video_id"
  end

  create_table "video_events", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "video_id"
    t.bigint "timecode_ms"
    t.string "type"
    t.jsonb "input"
    t.jsonb "payload"
    t.uuid "user_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "published", default: true
    t.index ["type"], name: "index_video_events_on_type"
    t.index ["user_id"], name: "index_video_events_on_user_id"
    t.index ["video_id", "published", "timecode_ms", "type"], name: "video_event_big_index"
    t.index ["video_id", "timecode_ms"], name: "index_video_events_on_video_id_and_timecode_ms"
    t.index ["video_id", "type"], name: "index_video_events_on_video_id_and_type"
    t.index ["video_id"], name: "index_video_events_on_video_id"
  end

  create_table "video_snapshots", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "video_id", null: false
    t.bigint "timecode"
    t.integer "viewer_count"
    t.string "device_id"
    t.string "device_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "priority"
    t.index ["video_id"], name: "index_video_snapshots_on_video_id"
  end

  create_table "video_view_minutes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "video_view_id"
    t.integer "minute"
    t.boolean "is_live"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["video_view_id"], name: "index_video_view_minutes_on_video_view_id"
  end

  create_table "video_views", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id"
    t.uuid "video_id", null: false
    t.jsonb "details"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_joined_event_id"
    t.datetime "last_seen_at"
    t.uuid "fingerprint"
    t.integer "video_view_minutes_count"
    t.index ["fingerprint", "video_id"], name: "index_video_views_on_fingerprint_and_video_id"
    t.index ["user_joined_event_id"], name: "index_video_views_on_user_joined_event_id"
    t.index ["video_id", "details", "user_id"], name: "index_video_views_on_video_id_and_details_and_user_id", unique: true
    t.index ["video_id", "fingerprint", "user_id"], name: "index_video_views_on_video_id_and_fingerprint_and_user_id", unique: true
    t.index ["video_id", "last_seen_at"], name: "index_video_views_on_video_id_and_last_seen_at"
    t.index ["video_id", "video_view_minutes_count"], name: "index_video_views_on_video_id_and_video_view_minutes_count"
  end

  create_table "videos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "title", default: "Untitled Broadcast"
    t.string "mux_playback_id"
    t.string "state"
    t.uuid "mux_live_stream_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name"
    t.text "description"
    t.string "hls_url"
    t.string "mux_asset_id"
    t.string "mux_asset_playback_id"
    t.integer "duration"
    t.bigint "started_at_ms"
    t.integer "active_viewers", default: 0
    t.integer "video_views_count"
    t.enum "visibility", default: "public", as: "visibility_setting"
    t.uuid "channel_id"
    t.datetime "scheduled_at"
    t.integer "start_offset", default: 0
    t.integer "end_offset", default: 0
    t.string "dash_url"
    t.string "end_reason"
    t.boolean "browser_broadcast", default: false, null: false
    t.index ["end_reason"], name: "index_videos_on_end_reason"
    t.index ["mux_asset_id"], name: "index_videos_on_mux_asset_id"
    t.index ["mux_live_stream_id"], name: "index_videos_on_mux_live_stream_id"
    t.index ["state", "scheduled_at"], name: "index_videos_on_state_and_scheduled_at"
    t.index ["state"], name: "index_videos_on_state"
    t.index ["user_id"], name: "index_videos_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "categories", "categories"
  add_foreign_key "hosts", "channels"
  add_foreign_key "hosts", "users"
  add_foreign_key "video_categories", "categories"
  add_foreign_key "video_categories", "videos"
  add_foreign_key "video_snapshots", "videos"
  add_foreign_key "videos", "users"
end
