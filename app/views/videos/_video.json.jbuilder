json.extract! video, :id, :user_id, :title, :created_at, :updated_at
json.url video_url(video, format: :json)
