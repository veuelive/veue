# frozen_string_literal: true

require "rails_helper"

describe BroadcastsController do

  before :each do
    @streamer = create(:streamer)
    login_as @streamer
  end

  it "should include the stream key!" do
    get broadcast_path

    expect(@streamer.stream_key).to have_attributes(size: (be > 2))
    expect(response.body).to include(@streamer.stream_key)
  end
end
