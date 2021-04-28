class RemoveBrowserNavigationData < ActiveRecord::Migration[6.1]
  def change
    VideoEvent.where(type: "BrowserNavigation").destroy_all
  end
end
