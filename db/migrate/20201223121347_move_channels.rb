class MoveChannels < ActiveRecord::Migration[6.0]
  def change
    Channel.delete_all

    User.all.each do |user|
      if user.mux_stream_key_ciphertext
        channel = user.channels.create!(
          mux_live_stream_id: user.mux_live_stream_id,
          mux_stream_key: user.mux_stream_key,
          name: user.display_name
        )
        Video.where(user_id: user.id).update_all(channel_id: channel.id)
      end
    end
  end
end
