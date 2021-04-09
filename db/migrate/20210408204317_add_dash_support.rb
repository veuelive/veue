class AddDashSupport < ActiveRecord::Migration[6.1]
  def change
    add_column :videos, :dash_url, :string
    add_column :videos, :end_reason, :string

    add_index :videos, :end_reason
  end
end
