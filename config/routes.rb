# frozen_string_literal: true
require 'sidekiq/web'

Rails.application.routes.draw do
  if ENV["VELVET_ROPE"]
    root "velvet_rope#index"
  else
    root "videos#index"
  end

  resources :videos, only: %i[index show new update] do
    member do
      post "viewed"
      post "reaction"
    end

    resources :events, only: %i[show index] do
      collection do
        get "recent"
      end
    end

    resources :chat_messages, only: %i[create index]
    resource :follow, only: %i[show create destroy]
  end

  resource :stream, only: :show do

  end

  resources :broadcasts, only: [:show, :index] do
    scope module: "broadcasts" do
      controller "event" do
        post "layout"
      end
    end

    member do
      post "navigation_update"
      post "start"
    end

    collection do
      get "blank"
      get "startup"
    end

    resources :pins
  end

  post "/mux/webhook", to: "mux_webhooks#index"

  resource :authentication do
    member do
      post :override
    end
  end

  unless Rails.env.production?
    post "ipc_mock", to: "application#ipc_mock"
    get "velvet_rope", to: "velvet_rope#index"
  end

  resources :users

  post "/mux/webhook", to: "mux_webhooks#index"

  ActiveAdmin.routes(self)

  Sidekiq::Web.use Rack::Auth::Basic do |username, password|
    # Protect against timing attacks:
    # - See https://codahale.com/a-lesson-in-timing-attacks/
    # - See https://thisdata.com/blog/timing-attacks-against-string-comparison/
    # - Use & (do not use &&) so that it doesn't short circuit.
    # - Use digests to stop length information leaking (see also ActiveSupport::SecurityUtils.variable_size_secure_compare)
    ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(username), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_USERNAME"])) &
      ActiveSupport::SecurityUtils.secure_compare(::Digest::SHA256.hexdigest(password), ::Digest::SHA256.hexdigest(ENV["SIDEKIQ_PASSWORD"]))
  end if Rails.env.production?

  mount Sidekiq::Web => '/_/sidekiq'
end
