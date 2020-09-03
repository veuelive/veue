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

    private

    def render_form
      render(
        partial: "form",
        locals: {resource: resource, resource_name: resource_name, request_method: :post, remote: true},
        content_type: "html",
      )
    end
  end
end
