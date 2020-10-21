# Veue

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
- Heroku (Hosting)
- AppSignal (APM)

## Streaming Architecture

This is the sequence diagram for how the Electron JS app works with other components and how we setup a
streamer session.

![Sequence Diagram](docs/Streamer%20Sequence%20Diagram.png)

The source for this image can be found in the `docs` folder. Please update whenever you can!

## Video Feeds

In the initial version, video feeds are laid out according to the following arrangement. The
streamers client is responsible for compositing the images this way.

![Video Layout](docs/Video%20Feed%20Layout%20and%20Specification.png)

## Developer Setup

Developing with this application is more complicated than some others due to the need to test and setup
video streaming. To do this we will need to setup all of the following:

1. Mux Test API Tokens
2. an ngrok tunnel
3. Configure Mux Webhook

\*\* The last one is only until we get Deskie up and running....

### Setup Mux Account

You should get an invite to Mux, and if you haven't, ask someone for one! Once you are signed up, go to the
[Environments page](https://dashboard.mux.com/environments) and create an Environment for yourself.

Put in your full name and select it as a "Development" environment. Once you have created it, go to settings
and create an API Token.

In your local copy of this repo, generate a file `config/application.yml` with the following properties:

```
MUX_TOKEN_ID: #{YOURTOKEN}
MUX_TOKEN_SECRET: #{YOURSECRET}
```

This file will be ignored by git... and leave it that way. Take this secret to your graaaaavvvveeeeeeeee.

Great, now let's setup the database. (I'm assuming here you know how to setup a standard Postgres install)

```
rake db:setup
```

This will seed the database for you with a couple users. However, these users aren't streamers yet... we need
to set them up to be streamers!

### Webhook Setup

Setup an account with [ngrok](https://ngrok.com/) and install the command line utility for it using their instructions.
Open a terminal and do the following:

```
$> ngrok http 3000
```

This will open a public endpoint that we can use for our webhook. Do not close this tab! Copy the https url in there.
It will look something like `https://edbd2cc7d2fc.ngrok.io`

Go to Mux.com and go into your settings. Click on Webhooks. Create a new webhook. Select your environment, and
set the webhook url to be something _like_ `https://edbd2cc7d2fc.ngrok.io/mux/webhook` by adding `/mux/webhook` to the
end of your ngrok tunnel.

### Setup Deskie

"Deskie" is the adorable name we give to the Electron.js app that we have for streamers. It's in the folder
`deskie` (duh) and you can start it up with a quick `yarn start`.

### Putting it all together...

Start up your Rails development server as you normally would!

`rails s`

You should be able to load the site on `localhost:3000` or alternately, you should be able to see it
if you load your ngrok hostname.
