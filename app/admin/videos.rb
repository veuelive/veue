# frozen_string_literal: true

ActiveAdmin.register(Video) do
  permit_params :title, :state, :description, :visibility, :scheduled_at,
                :start_offset, :end_offset, :active_admin_requested_event

  # Needed for AASM + ActiveAdmin
  # https://github.com/activeadmin/activeadmin/wiki/How-to-work-with-AASM
  after_save do |video|
    event = params[:video][:active_admin_requested_event]

    if event.present?
      # allow list to ensure we don't run an arbitrary method
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
    column :created_at
    column :start_offset
    column :end_offset
  end

  # /:id/show
  show do
    attributes_table do
      row :id do |video|
        link_to video.id, edit_admin_video_path(video)
      end
      row :channel
      row :title
      state_row :state
      row :visibility
      row :started_at
      row :start_offset
      row :end_offset
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

      # display current state as disabled to avoid modifying it directly
      f.input(:state, input_html: {disabled: true}, label: "Current state")

      f.input(:start_offset)
      f.input(:end_offset)

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
