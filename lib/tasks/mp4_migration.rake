# frozen_string_literal: true

task mp4_migration: :environment do
  MigrateVideoStorageJob.perform_later
end
