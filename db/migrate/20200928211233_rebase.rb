class Rebase < ActiveRecord::Migration[6.0]
  def change
    create_table "mux_assets", id: :uuid do |t|
      t.string "mux_status"
      t.string "mux_id"
      t.string "mux_playback_id"
      t.uuid "video_id"
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

    create_table "mux_live_streams",id: :uuid do |t|
      t.uuid "user_id"
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

    create_table "mux_webhooks", id: :uuid  do |t|
      t.string "mux_target_type"
      t.uuid "mux_target_id"
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

    create_table "session_tokens", id: :uuid  do |t|
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

    create_table "users", force: :cascade, id: :uuid do |t|
      t.inet "current_sign_in_ip"
      t.inet "last_sign_in_ip"
      t.integer "failed_attempts", default: 0, null: false
      t.uuid "mux_live_stream_id"
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.text "phone_number_ciphertext", null: false
      t.string "phone_number_bidx"
      t.string "display_name"
      t.string "slug"
      t.index ["mux_live_stream_id"], name: "index_users_on_mux_live_stream_id"
      t.index ["slug"], name: "index_users_on_slug", unique: true
    end

    create_table "video_events", force: :cascade, id: :uuid  do |t|
      t.uuid "video_id", foreign_key: true
      t.bigint "timecode_ms"
      t.string "type"
      t.jsonb "input"
      t.jsonb "payload"
      t.uuid "user_id", foreign_key: true
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.index ["type"], name: "index_video_events_on_type"
      t.index ["user_id"], name: "index_video_events_on_user_id"
      t.index ["video_id", "timecode_ms"], name: "index_video_events_on_video_id_and_timecode_ms"
      t.index ["video_id", "type"], name: "index_video_events_on_video_id_and_type"
      t.index ["video_id"], name: "index_video_events_on_video_id"
    end

    create_table "videos", force: :cascade, id: :uuid  do |t|
      t.uuid "user_id", null: false
      t.string "slug"
      t.string "title"
      t.string "mux_playback_id"
      t.string "state"
      t.uuid "mux_live_stream_id", foreign_key: true
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.string "name"
      t.text "description"
      t.string "hls_url"
      t.index ["mux_live_stream_id"], name: "index_videos_on_mux_live_stream_id"
      t.index ["slug"], name: "index_videos_on_slug", unique: true
      t.index ["state"], name: "index_videos_on_state"
      t.index ["user_id"], name: "index_videos_on_user_id"
    end

    add_foreign_key "mux_assets", "videos"
    add_foreign_key "videos", "users"
  end
end
