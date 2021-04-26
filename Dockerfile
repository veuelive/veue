# This is intended to only be used by Render.
# Do not use this for local development.
# You have been warned.
FROM ruby:2.7 AS veue-rails

ARG USER_ID
ARG GROUP_ID

RUN addgroup --gid $GROUP_ID user
RUN adduser --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID user

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg -o /root/yarn-pubkey.gpg && apt-key add /root/yarn-pubkey.gpg
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list

# Adds nodejs and upgrade yarn
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  nodejs \
  yarn \
  postgresql-client \
  && rm -rf /var/lib/apt/lists/*

ENV APP_PATH /opt/app/veue
RUN mkdir -p $APP_PATH

WORKDIR $APP_PATH
COPY . .
RUN rm -rf node_modules vendor
RUN gem install rails bundler
RUN bundle install
RUN yarn install
RUN chown -R user:user /opt/app

USER $USER_ID
ENTRYPOINT ["/bin/render-build.sh"]
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb", "-b", "0.0.0.0"]
