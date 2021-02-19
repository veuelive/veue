# frozen_string_literal: true

ActiveAdmin.register(Video) do
  permit_params :title, :state, :description, :visibility, :scheduled_at, :active_admin_requested_event

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
        collection: Video.aasm.events.map(&:name),
      )
    end
    f.actions
  end
end
