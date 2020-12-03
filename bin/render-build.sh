#!/usr/bin/env bash
# exit on error
set -o errexit

bundle config --local gems.contribsys.com ab21b078:c8a6ea8f

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rake db:migrate