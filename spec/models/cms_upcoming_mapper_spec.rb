# frozen_string_literal: true

require "rails_helper"

RSpec.describe CmsUpcomingMapper do
  let(:data_mapper) { CmsUpcomingMapper.new(data) }

  let!(:channel_one) { create(:channel, next_show_at: 2.days.from_now) }
  let!(:channel_two) { create(:channel, next_show_at: 1.day.from_now) }

  describe "for static upcoming" do
    let(:title) { "My static upcoming" }
    let(:data) {
      {
        type: "static_upcoming",
        fields: {
          title: title,
          upcoming_broadcasts: [
            {slug: channel_one.slug},
            {slug: channel_two.slug},
          ],
        },
      }
    }

    it "should have both channels" do
      shows = data_mapper.shows

      expect(shows).to include(channel_one.decorate)
      expect(shows).to include(channel_two.decorate)
    end
  end

  describe "for dynamic upcoming" do
    let(:title) { "My dynamic upcoming" }

    let(:data) {
      {
        type: "dynamic_upcoming",
        fields: {
          title: title,
          max_size: 1,
        },
      }
    }

    it "should contain only the most recent show" do
      shows = data_mapper.shows

      expect(shows.size).to eq(1)
      expect(shows.first).to eq(channel_two.decorate)
    end
  end
end
