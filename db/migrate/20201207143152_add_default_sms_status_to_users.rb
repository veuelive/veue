class AddDefaultSmsStatusToUsers < ActiveRecord::Migration[6.0]
  def up
    execute "ALTER TABLE users ALTER COLUMN sms_status SET DEFAULT 'new_number'"
    User.update_all(sms_status: "new_number")
  end
end
