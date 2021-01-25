# frozen_string_literal: true
require 'sidekiq/web'

Rails.application.routes.draw do
  if ENV["VELVET_ROPE"]
    root "velvet_rope#index"
  else
    root "discover#index"
  end

  resources :broadcasts, only: [:show, :index, :update] do
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

  resources :users, only: [:create, :edit, :update, :destroy]
  
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

  get '/health', to: "health_check#index"

  mount Sidekiq::Web => '/_/sidekiq'

  scope module: :channels, path: ":channel_id", as: "channel" do
    get "/" => "channels#show"
    post "viewed" => "channels#viewed"

    resource :follow, only: %i[show create destroy]

    resources :videos, only: %i[show] do
      member do
        post "viewed"
      end

      # These are the routes related to viewing a finished stream
      # everything in here is scoped by the Video and it's ID
      namespace :vod, path: "" do
        resources :events, only: %i[show index]
      end
    end

    # These are the routes related to the "Streamers" profile page
    # and also where you watch their live broadcast
    namespace :live, path: "" do
      resources :chat_messages, only: %i[create index]
      resources :events, only: %i[index]
      resources :reactions, only: %i[create]
    end
  end
end
