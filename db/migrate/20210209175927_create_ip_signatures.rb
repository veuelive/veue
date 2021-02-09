class CreateIpSignatures < ActiveRecord::Migration[6.0]
  def change
    create_table :ip_signatures, id: :uuid do |t|
      t.string :ip_address
      t.string :location
      t.timestamps
    end
  end
end
