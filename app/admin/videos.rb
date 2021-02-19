# frozen_string_literal: true

ActiveAdmin.register(Video) do
  permit_params :title, :state, :description, :visibility, :scheduled_at, :active_admin_requested_event

  after_save do |video|
    event = params[:video][:active_admin_requested_event]

    if event.present?
      # whitelist to ensure we don't run an arbitrary method
      safe_event = (video.aasm.events(permitted: true).map(&:name) & [event.to_sym]).first
      raise StandardError.new("Forbidden event #{event} requested on instance #{your_model.id}") unless safe_event

      # launch the event with bang
      video.public_send("#{safe_event}!")
    end
  end

  index do
    selectable_column
    column(:id) do |video|
      link_to video.id, admin_video_path(video)
    end
    column(:channel)
    column(:title)
    column(:visibility)
    column(:scheduled_at)
  end

  form do |f|
    f.semantic_errors
    f.inputs do
      f.input(:title)
      f.input(:description, input_html: {rows: "5"})
      f.input(:visibility, as: :select)
      f.input(
        :scheduled_at,
        as: :datepicker,
        datepicker_options: {
          min_date: "Time.now.strftime('%Y-%m-%d')",
          max_date: "+3W",
        },
      )

      # display current state as disabled to avoid modifying it directly
      f.input(:state, input_html: {disabled: true}, label: "Current state")

      # use the attr_accessor to pass the data
      f.input(
        :active_admin_requested_event,
        label: "Change state",
        as: :select,
        collection: f.object.aasm.events(permitted: true).map(&:name),
      )
    end
    f.actions
  end
end
