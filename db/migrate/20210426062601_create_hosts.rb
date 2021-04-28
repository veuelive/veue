class CreateHosts < ActiveRecord::Migration[6.1]
  def change
    create_table :hosts, id: :uuid do |t|
      t.belongs_to :channel, foreign_key: true, type: :uuid
      t.belongs_to :user, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:user_id, :channel_id]
    end
  end
end
