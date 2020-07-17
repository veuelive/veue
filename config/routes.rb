Rails.application.routes.draw do
  resources :streams

  post '/mux/webhook', to: "mux_webhooks#index"

  devise_for :users

  devise_for :admins
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "velvet_rope#index"
end
