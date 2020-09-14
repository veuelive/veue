class RemoveDevise < ActiveRecord::Migration[6.0]
  def change
    drop_table :admins

    fields = %w(confirmation_sent_at confirmation_token confirmed_at current_sign_in_at email encrypted_password first_name last_name last_sign_in_at locked_at remember_created_at reset_password_sent_at reset_password_token sign_in_count unconfirmed_email unlock_token username)

    fields.each do |field|
      remove_column :users, field
    end
  end
end
