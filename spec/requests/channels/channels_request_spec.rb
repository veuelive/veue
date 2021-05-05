# frozen_string_literal: true

require "rails_helper"

describe Channels::ChannelsController do
  describe "UPDATE channel and its icon" do
    let(:channel) { create(:channel) }
    before do
      login_as(channel.user)
    end

    it "should update channel" do
      name_text = "My Favorite Channel"
      bio_text = "My Channel Bio"

      put "/channels/#{channel.id}", params: {channel: {name: name_text, bio: bio_text}}

      expect(channel.reload.name).to eq(name_text)
      expect(channel.reload.bio).to eq(bio_text)
    end

    it "should update channle icon" do
      image = fixture_file_upload("spec/factories/test.png", "image/png")

      put "/channels/#{channel.id}/upload_image", params: {channel_icon: image}
      expect(response).to have_http_status(:success)

      channel.reload
      expect(channel.channel_icon.attached?).to eq(true)
    end
  end

  describe "Remove channel image" do
    let(:channel) { create(:channel) }

    before do
      login_as channel.user
    end

    it "shoud remove channel icon from channel" do
      # attach image with channel to delete
      channel.channel_icon.attach(fixture_file_upload("spec/factories/test.png", "image/png"))
      expect(channel.channel_icon.attached?).to eq(true)

      delete "/channels/#{channel.id}/destroy_image"
      expect(response).to have_http_status(:success)

      channel.reload
      expect(channel.channel_icon.attached?).to eq(false)
    end
  end
end
