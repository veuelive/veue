# frozen_string_literal: true

ActiveAdmin.register(Video) do
  permit_params :title, :state, :description, :visibility, :scheduled_at, :active_admin_requested_event

  # Needed for AASM + ActiveAdmin
  # https://github.com/activeadmin/activeadmin/wiki/How-to-work-with-AASM
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

  # /index
  index do
    selectable_column
    column :id do |video|
      link_to video.id, admin_video_path(video)
    end
    column :channel
    column :title
    state_column :state
    column :visibility
    column "Scheduled at (UTC)", :scheduled_at
  end

  # /:id/show
  show do
    attributes_table do
      row :id do |video|
        link_to video.id, edit_admin_video_path(video)
      end
      row :channel
      row :title
      row :description
      state_row :state
      row :visibility
      row :scheduled_at do |video|
        text_node "#{video.scheduled_at}"
      end
    end
    active_admin_comments
  end

  # /:id/edit
  form do |f|
    f.semantic_errors
    f.inputs do
      f.input(:title)
      f.input(:description, input_html: {rows: "5"})
      f.input(:visibility, as: :select, include_blank: false)
      f.input(
        :scheduled_at,
        as: :date_time_picker,
        picker_options: {
          format: "d-m-Y H:i",
          step: 30,
        },
        label: "Scheduled At (UTC Time)"
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
