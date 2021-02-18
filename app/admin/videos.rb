ActiveAdmin.register Video do
  # See permitted parameters documentation:
  # https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
  #
  # Uncomment all parameters which should be permitted for assignment
  #
  # permit_params :user_id, :title, :mux_playback_id, :state, :mux_live_stream_id, :name, :description, :hls_url, :mux_asset_id, :mux_asset_playback_id, :duration, :started_at_ms, :active_viewers, :video_views_count, :visibility, :channel_id, :scheduled_at
  #
  # or
  #
  # permit_params do
  #   permitted = [:user_id, :title, :mux_playback_id, :state, :mux_live_stream_id, :name, :description, :hls_url, :mux_asset_id, :mux_asset_playback_id, :duration, :started_at_ms, :active_viewers, :video_views_count, :visibility, :channel_id, :scheduled_at]
  #   permitted << :other if params[:action] == 'create' && current_user.admin?
  #   permitted
  # end

end
