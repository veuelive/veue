# frozen_string_literal: true

class HealthCheckController < ApplicationController
  def index
    db_connections_query = ActiveRecord::Base.connection.execute(
      "SELECT count(*) FROM pg_stat_activity WHERE state='active'; ",
    )
    db_connections = db_connections_query.count
    sidekiq_workers = Sidekiq::Workers.new.count

    live_videos = Video.where(state: "live").count

    render(json: {
             status: "OK",
             db_connections: db_connections,
             live_videos: live_videos,
             sidekiq_workers: sidekiq_workers,
           })
  end
end
