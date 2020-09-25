class AddHlsUrl < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :hls_url, :string
  end
end
