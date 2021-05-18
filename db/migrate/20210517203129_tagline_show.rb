class TaglineShow < ActiveRecord::Migration[6.1]
  def change
    rename_column :channels, :bio, :description
    # doing a larger limit here than we would have in prod
    add_column :channels, :tagline, :string, limit: 70
  end
end
