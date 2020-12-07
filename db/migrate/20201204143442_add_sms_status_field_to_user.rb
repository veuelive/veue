class AddSmsStatusFieldToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :sms_status, :integer, default: 0
  end
end
