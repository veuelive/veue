Rails.application.routes.draw do
  resources :streams
  #
  # devise_for :users, controllers: {
  #     sessions: 'users/sessions'
  # }
  #
  # devise_for :admins
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "velvet_rope#index"
end
