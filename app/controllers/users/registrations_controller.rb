# frozen_string_literal: true

module Users
  class RegistrationsController < Devise::RegistrationsController
    # GET /resource/sign_up
    def new
      respond_to do |format|
        build_resource
        yield(resource) if block_given?

        format.html { respond_with resource }
        format.js { render_form }
      end
    end

    def create
      respond_to do |format|
        format.html { super }
        format.js {
          create_user
          render_js_response
        }
      end
    end

    private

    def create_user
      build_resource(sign_up_params)
      resource.save!
    end

    def render_js_response
      if resource.persisted?
        sign_up(resource_name, resource)
      else
        expire_data_after_sign_in!
      end
      render(partial: "layouts/nav/user_area", content_type: "html")
    end

    def render_form
      render(
        partial: "form",
        locals: {resource: resource, resource_name: resource_name, request_method: :post, remote: true, type: "json"},
        content_type: "html",
      )
    end
  end
end
