module ChannelHelper
  def minutes_of_day_for_select
    entries = []
    24.times do |hour|
      entries << [I18n.l(Time.zone.parse("#{hour}:00"), format: :short), hour * 60]
      entries << [I18n.l(Time.zone.parse("#{hour}:30"), format: :short), (hour * 60) + 30]
    end
    entries
  end

  def custom_timezone_options
    ActiveSupport::TimeZone.all.map do |zone|
      [zone.name, zone.tzinfo.identifier]
    end
  end
end