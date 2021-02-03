# Veue

### Quick Links

- Production:

  - [Site](https://www.veuelive.com)
  - [SideKiq UI](https://www.veuelive.com/_/_/sidekiq)
  - [Render Service](https://dashboard.render.com/web/srv-bukoj3m9ph1hqurcua20)
  - [APM](https://appsignal.com/veue/sites/5f1b3af314ad66221c331630/dashboard)
  - [Logs](https://app.logdna.com/e4202f546b/logs/view/560b2cfe31)

- Stage
  - [Site](https://preshow.veuelive.com)
  - [SideKiq UI](https://prewshow.veuelive.com/_/_/sidekiq)
  - [Render Service](https://dashboard.render.com/web/srv-bv4jnvgn4r071o276gbg)
  - [APM](https://appsignal.com/veue/sites/5f9c4d5c7478205001c50b2a/dashboard)
  - [Logs](https://app.logdna.com/e4202f546b/logs/view/9603e9e850)

## Introduction

This is the primary Rails application for Veue. It's designed to be as standard of a Rails app as is possible,
using the best practices of the Rails community and the included tooling around the ecosystem.

We use the following technologies:

- Postgres
- Haml
- Sass CSS
- Webpacker
- Stimulus.js
- Typescript

We use the following Third-Party services:

- Mux (Video Streaming platform)
- Render (Hosting)
- AppSignal (APM)
- LogDNA (Logging)
- Google Perpsective (Content Filtering)
- IFTTT (Triggered Events)
- Twilio (SMS)
- AWS S3 (Image Storage)

## Developer Setup

### 1. Setup Mux Account

You should get an invite to Mux, and if you haven't, ask someone for one! Once you are signed up, go to the
[Environments page](https://dashboard.mux.com/environments) and create an Environment for yourself.

Once there, you should be able to "Add Environment" on the "Environments" page

Put in your full name and select it as a "Development" environment. It
will also ask you about `Video` and `Data`. Give yourself `Full Access`
for Video, and leave the `Read` access for `Data` unchecked.

Once you have created the Environment, go to settings and create an API Token.

In your local copy of this repo, generate a file `config/application.yml` with the following properties:

```yaml
# config/application.yml

MUX_TOKEN_ID: #{YOURTOKEN}
MUX_TOKEN_SECRET: #{YOURSECRET}
```

This file will be ignored by git... and leave it that way. Take this secret to your graaaaavvvveeeeeeeee.

### 2. Postgres

For Postgres installation, visit this page: https://www.postgresql.org/download/

### 3. Ruby, Rails & Database Setup

First, lets pull in our dependencies:

```bash
bundle install && yarn install --check-files
```

Great, now let's setup the app & database. Run the following in your
terminal:

```bash
rake db:setup
```

This will create the database, migrate the database, and seed the
database for you with a couple users. However, these users aren't
streamers yet... we need to set them up to be streamers!

Run the Rails server
(from root of the project in a new shell)

`rails s`

### 4. Webhook With Ngrok Setup

This tool runs a magic TSL tunnel back to your machine as long as you keep it open in shell.

First download the executable from https://ngrok.com/download

You can test it from the examples on their download page. It creates a tunnel at a public URL back to an app running on your machine, only for the specified port. (Exit with Ctrl-C and the tunnel will be broken.)

To install, use `brew install --cask ngrok` or `yarn global add ngrok` depending on your preferences.

In a web browser, go to https://dashboard.ngrok.com/ and login with your Veue Google Account. This will give you 
a free pro ngrok account. Follow Step 2 which sets up your auth token.

To run ngrok:

```bash
$> ngrok http 3000
```

Look for two "Forwarding" URLs with random subdomain strings for .ngrok.io
(The second one will be https)

This will open a public endpoint that we can use for our webhook. Do not close this tab! Copy the https url in there.
It will look something like `https://username.ngrok.io`

Go to Mux.com and go into your settings. Settings > Webhooks API > Select your environment, and
set the webhook url to be the https ngrok URL from above + `/mux/webhook` (something _like_ `https://edbd2cc7d2fc.ngrok.io/mux/webhook`) by adding `/mux/webhook` to the
end of your ngrok tunnel.

### 6. Webpacker (OPTIONAL)

To speed up development of TS files
(from root of the project in a new shell)

```bash
./bin/webpack-dev-server
```

### 7. Setup Broadcaster

"Broadcaster" is the name we give to the Electron.js app that we have for streamers. It's in the folder
`broadcaster` (duh) and you can start it up with a quick `yarn start`.

_You need to be running Ngrok AND the Rails app for this to work!_

From root of the project in a new shell

```bash
cd broadcaster/
yarn install
yarn start
```

An Electron app will launch. By default, the app opens with the Chrome debugging tools shown, making the layout 
look awkward. Close them using the X in the top-right of the window.

If you successfully login using the Broadcaster, it means that everything is working... NGrok, Mux, etc.

### Your Own Data?

To make the site work locally, you should follow the directions for how to do a Broadcast with the
Broadcaster and make your own data.

### Troubleshooting

#### `bundle install` issues

If you get a crash when running `gem install puma -v '4.3.5' --source 'https://rubygems.org/'`, this strange Puma build error has been reported on macOS Catalina and Big Sur

```bash
puma_http11.c:203:22: error: implicitly declaring library function 'isspace' with type 'int (int)' [-Werror,-Wimplicit-function-declaration]
```

to fix run

```bash
gem install puma:4.3.5 -- --with-cflags="-Wno-error=implicit-function-declaration"
```

Then re-run `bundle install` and it should run through cleanly now.

for more info see https://thoughtfulapps.com/articles/rails/puma-implicitly-declaring-library-function-error

#### MuxRuby::UnauthorizedError

```
MuxRuby::UnauthorizedError in BroadcastsController
```

If you see this, then your MUX tokens aren't setup correctly!


## Checks

We use both testing and linters and formatters to ensure consistency in our codebase. On every PR, the 
following are checked:

### Rspec

To run the test suite run:

`rails spec`

### Prettier — FOR TYPESCRIPT/JAVASCRIPT

To run on the entire codebase, run
`yarn prettier  app/ spec/`

To run on only one file, run

`yarn prettier app/javascript/controllers/my_controller.ts`

However, running prettier this way _doesn't actually change or prettify your files_. All it does is give you warnings.

To have prettier actually re-write your files, you'll want to run it with the `--write` flag.

`yarn prettier --write app/ spec/`

You'll want to do this for any Typescript file or spec you add or modify.

### Rubocop — For Ruby

Make sure any Ruby code you add or modify passes Rubocop.

You do this by running `rubocop` on your console. To tell Rubocop to correct your syntax for you use `rubocop -A`

The full docs are here: https://docs.rubocop.org/rubocop/1.3/index.html

## Streaming Architecture

This is the sequence diagram for how the Electron JS app works with other components and how we setup a
streamer session.

![Sequence Diagram](docs/Streamer%20Sequence%20Diagram.png)

The source for this image can be found in the `docs` folder. Please update whenever you can!

## Environment Variables

### Flags
These may need to be changed on occasion

```
VELVET_ROPE: true/false - Is the landing page on the root or not?
PERSPECTIVE_API_ENABLED: true/false - Used to turn on or off the Perspective API
PERSPECTIVE_API_SCORE_THRESHOLD: 0.0...1.0 - Cutoff values for not publishing chat messages, 1.0 being the worst and 0.0 being innocent
````

### Third Party Configurations

#### AppSignal
````
APPSIGNAL_FRONTEND_KEY: string - Needed for AppSignal Javascript Reporting
APPSIGNAL_PUSH_API_KEY: string - AppSignal's Backend Push Key
APPSIGNAL_APP_ENV: string - AppSignal "environment" tag, used to structure reporting in Appsignal
````

#### Google

```
GOOGLE_CLOUD_KEY: string - Access to the Google Cloud Perspective API
```

#### Mux

```ts
MUX_TOKEN_ID
MUX_TOKEN_SECRET
```

#### AWS

Used for S3 storage

```ts
AWS_ACCESS_KEY_ID
AWS_BUCKET
AWS_SECRET_ACCESS_KEY
```

#### LogDNA

```ts
LOG_DNA_KEY
```

#### Twilio

```ts
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER - The actual phone number we send from
```

#### IFTTT

```ts
IFTTT_PUSH_KEY
```

