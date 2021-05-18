# frozen_string_literal: true

require "rails_helper"

describe Channels::ChannelsController do
  let(:channel) { create(:channel) }

  it "stops bad access" do
    put "/channels/#{channel.id}"

    expect(response).to have_http_status(404)

    login_as(create(:user))

    put "/channels/#{channel.id}"

    expect(response).to have_http_status(404)

    # Admins are okay though!
    login_as(create(:admin))

    expect(response).to have_http_status(204)
  end

  describe "logged in as host" do
    before do
      login_as(channel.user)
    end

    describe "UPDATE channel and its icon" do
      it "should update channel" do
        name = "My Favorite Channel"
        tagline = "My Channel Bio"
        description = Faker::Lorem.sentence

        put "/channels/#{channel.id}", params: {channel: {name: name, tagline: tagline, description: description}}

        channel.reload

        expect(channel.name).to eq(name)
        expect(channel.tagline).to eq(tagline)
        expect(channel.description).to eq(description)
      end

      it "should update channel icon" do
        image = fixture_file_upload("spec/factories/test.png", "image/png")

        put "/channels/#{channel.id}/upload_image", params: {channel_icon: image}
        expect(response).to have_http_status(:success)

        channel.reload
        expect(channel.channel_icon.attached?).to eq(true)
      end
    end

    describe "Remove channel image" do
      it "should remove channel icon from channel" do
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
end
