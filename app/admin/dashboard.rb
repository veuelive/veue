# frozen_string_literal: true

ActiveAdmin.register_page("Dashboard") do
  menu priority: 1, label: proc { I18n.t("active_admin.dashboard") }

  content title: proc { I18n.t("active_admin.dashboard") } do
    link_to "Videos", admin_videos_path
  end
end
