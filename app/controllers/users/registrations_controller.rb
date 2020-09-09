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
          build_resource(sign_up_params)
          return_js_response
        }
      end
    end

    private

    def return_js_response
      if resource.persisted?
        sign_up(resource_name, resource)
      else
        expire_data_after_sign_in!
      end
      render_partial
    end

    def render_partial
      if resource.save
        render(partial: "layouts/nav/user_area", content_type: "html")
      else
        render(partial: "shared/errors", locals: {errors: resource.errors.full_messages}, content_type: "html")
      end
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
