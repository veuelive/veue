
export DD_VERSION=${RENDER_GIT_COMMIT:0:6}

bundle exec puma -C config/puma.rb