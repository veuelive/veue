# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  # Use streamer since streamers are users with more permissions
  # An issue was found specific to mux_webhooks not being referenced in our migrations
  let!(:user) { create(:streamer) }

  it "should allow us to delete users" do
    expect { user.destroy! }.to change { User.count }.from(1).to(0)
  end
end
