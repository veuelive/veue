# frozen_string_literal: true

require "rails_helper"

RSpec.describe SessionToken, type: :model do
  context "creation" do
    it "should generate a secret code" do
      phone_number = "+19043840459"
      ula = SessionToken.create!(phone_number: phone_number)
      expect(ula.user).to be_nil
      expect(ula.secret_code.length).to be(4)
      expect(ula.uuid.length).to be(36)
      expect(ula.id).to_not be_nil
    end

    it "should validate the phone number" do
      %w[Abc 1235 23427309784329087230497823908743208724309].each do |bad_number|
        ula = build_stubbed(:session_token, phone_number: bad_number)
        expect(ula).to_not be_valid
        expect(ula.errors["phone_number"]).to_not be_empty
      end

      ["+19043840459", "+44 7911 123456"].each do |valid_number|
        ula = build_stubbed(:session_token, phone_number: valid_number)
        expect(ula).to be_valid
        expect(ula.errors["phone_number"]).to be_empty
      end
    end

    it "should normalize the phone number" do
      ula = create(:session_token, phone_number: "+1 (904) 384-0459")
      expect(ula.phone_number).to eq("+19043840459")
    end
  end

  context "no user account" do
    it "should fail with a bad code" do
      ula = create(:session_token, phone_number: "+19043840459")
      expect(ula).to be_valid

      perform_enqueued_jobs

      # Background tasks will have happened here!
      ula.reload

      expect(ula.state).to eq("pending_confirmation")

      ula.process_secret_code!("1000")
      expect(ula.state).to eq("incorrect")

      # But, it's too late!!!
      ula.process_secret_code!(ula.secret_code)
      expect(ula.state).to eq("incorrect")
    end

    it "can create successful session without a user" do
      ula = SessionToken.create!(phone_number: "+19043840459")
      expect(ula).to be_valid

      perform_enqueued_jobs

      # Background tasks will have happened here!
      ula.reload

      expect(ula.state).to eq("pending_confirmation")

      ula.process_secret_code!(ula.secret_code)

      expect(ula.state).to eq("active")

      expect(ula.user).to be_nil

      # This is very valid, because it means you just need to go sign up!

      ula.reload

      ula.create_user("Hampton C")

      expect(ula.user).to be_valid
      expect(ula.user.display_name).to eq("Hampton C")
    end
  end

  describe "Existing users" do
    let(:user) { create(:user) }

    it "should use the existing user!" do
      ula = SessionToken.create!(user: user)
      expect(ula).to be_valid
      expect(ula.phone_number).to eq(user.phone_number)
    end
  end
end
