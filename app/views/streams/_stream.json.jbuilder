json.extract! stream, :id, :slug, :stream_key, :name, :state, :created_at, :updated_at
json.url stream_url(stream, format: :json)
