# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Deskies", type: :request do
  it "should require authentication!" do
    get deskie_user_data_path
    expect(response).to redirect_to(new_user_session_path)
  end

  context "the user is a streamer" do
    it "should send the stream key" do
      @streamer = create(:streamer)
      sign_in @streamer

      get deskie_user_data_path

      expect(response.body).to include_json(
        stream_key: MuxLiveStream.first.stream_key,
      )
    end
  end
end
