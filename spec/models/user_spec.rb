# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  # Use streamer since streamers are users with more permissions
  # An issue was found specific to mux_webhooks not being referenced in our migrations
  let!(:user) { create(:streamer) }

  it "should allow us to delete users" do
    expect { user.destroy! }.to change { User.count }.from(1).to(0)
  end

  it "should not allow us to create inappropriately named users" do
    PerspectiveApi.key = "FAIL"
    expect { create(:user) }.to raise_error(ActiveRecord::RecordInvalid)

    new_user = build(:user)
    expect(new_user.save).to eq(false)
    expect(new_user.errors.added?(:display_name, "is not appropriate")).to eq(true)
  end
end
