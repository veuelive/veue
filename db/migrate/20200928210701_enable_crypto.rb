class EnableCrypto < ActiveRecord::Migration[6.0]
  def change
    enable_extension "plpgsql"
  end
end
