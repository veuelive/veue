# Veue

This is the primary Rails application for Veue. It's designed to be as standard of a Rails app as is possible,
using the best practices of the Rails community and the included tooling around the ecosystem.

We use the following technologies:

* Postgres
* Haml
* Sass CSS
* Webpacker
* Stimulus.js
* Typescript

We use the following Third-Party services:

* Mux (Video Streaming platform)
* Heroku (Hosting)
* AppSignal (APM)

## Developing

Developing with this application is more complicated than some others due to the need to test and setup
video streaming. To do this we will need to setup all of the following:

1) Mux Test API Tokens
2) an ngrok tunnel
3) Configure Mux Webhook
4) Setup OBS for streaming**

** The last one is only until we get Deskie up and running....

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

```
$> rails c
2.7.1 :001 > User.find_by_email("test@veuelive.com").setup_as_streamer!
```

If you've setup Mux correctly above, this will reach out to the Mux system and generate a streamer key for the
user... creating a related `MuxLiveStream` model instance attached to the user. Let's get the streamer key!

```
2.7.1 :002 > MuxLiveStream.first.stream_key
 => "18608c29-d449-ca3d-89f3-4db5ca4c5214"
```

Great, now we have a stream key that we can use to stream to Mux.

### OBS Setup

This is useful for testing initially, as OBS is a standard way to do RTMP streams.

First, install [OBS](https://obsproject.com/) from their homepage. Should be pretty simple.

Once the application is open, go to settings and set the following...

Stream > Server > "rtmp://global-live.mux.com:5222/app"
Stream > Stream Key > The one you got above!
Video > Base Resolution > 2048x2048
Video > Output Resolution > 2048x2048

Setup your scene so that there is a 2048x1440 Browser window at the top, and a 608 pixel high "Video Capture"
stream (that's your webcam) in the bottom right corner.

![image](https://user-images.githubusercontent.com/111/89562488-04bb7500-d7e8-11ea-8b1f-9bcf190ea67c.png)

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

### Putting it all together...

Start up your Rails development server as you normally would!

`rails s`

You should be able to load the site on `localhost:3000` or alternately, you should be able to see it 
if you load your ngrok hostname.

If you click "Start Stream" in OBS, then that should connect to Mux, then Mux should send a signal via the 
webhook, that will go through your ngrok and hit your local development server. This will generate a new
`Video` and in a few seconds, you should see a live stream on your local machine! YAYYYY!