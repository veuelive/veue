class AddSmsStatusFieldToUser < ActiveRecord::Migration[6.0]
  def up
    create_enum "sms_status_setting", %w[new_number instructions_sent unsubscribed]
    add_column :users, :sms_status, :sms_status_setting
  end

  def down
    remove_column :users, :sms_status
    drop_enum "sms_status_setting"
  end
end
