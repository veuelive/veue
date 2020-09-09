# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    # GET /resource/sign_in
    def new
      respond_to do |format|
        build_resource
        format.html { respond_with(resource, serialize_options(resource)) }
        format.js { render_form }
      end
    end

    # POST /resource/sign_in
    def create
      respond_to do |format|
        create_resource
        format.html {
          set_flash_message!(:notice, :signed_in)
          respond_with(resource, location: after_sign_in_path_for(resource))
        }

        format.js {
          render_partial
        }
      end
    end

    # DELETE /resource/sign_out
    def destroy
      respond_to do |format|
        signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
        format.html {
          yield if block_given?
          set_flash_message!(:notice, :signed_out) if signed_out
          redirect_to(after_sign_out_path_for(resource_name))
        }

        format.js {
          render(partial: "layouts/nav/user_area", content_type: "html")
        }
      end
    end

    private

    def render_form
      render(
        partial: "form",
        locals: {resource: resource, resource_name: resource_name, remote: true},
        content_type: "html",
      )
    end

    def render_partial
      if resource
        render(partial: "layouts/nav/user_area", content_type: "html")
      else
        render(partial: "shared/errors", locals: {errors: ["Invalid Username or Password"]}, content_type: "html")
      end
    end

    def build_resource
      self.resource = resource_class.new(sign_in_params)
      clean_up_passwords(resource)
      yield(resource) if block_given?
    end

    def create_resource
      self.resource = warden.authenticate(auth_options)
      return if resource.blank?

      sign_in(resource_name, resource)
      yield(resource) if block_given?
    end
  end
end
