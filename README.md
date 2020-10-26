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

### 1. Setup Mux Account

You should get an invite to Mux, and if you haven't, ask someone for one! Once you are signed up, go to the
[Environments page](https://dashboard.mux.com/environments) and create an Environment for yourself.

Once there, you should be able to "Add Environment" on the "Environments" page

Put in your full name and select it as a "Development" environment. Once you have created it, go to settings
and create an API Token.

In your local copy of this repo, generate a file `config/application.yml` with the following properties:

```
MUX_TOKEN_ID: #{YOURTOKEN}
MUX_TOKEN_SECRET: #{YOURSECRET}
```

This file will be ignored by git... and leave it that way. Take this secret to your graaaaavvvveeeeeeeee.

### 2. Postgres

### 3. Redis

### 4. Ruby, Rails & Database Setup

Great, now let's setup the app & database. You will need

```
rake db:setup
```

This will seed the database for you with a couple users. However, these users aren't streamers yet... we need
to set them up to be streamers!

Run the Rails server
(from root of the project in a new shell)
`rails s`

### 5. Webhook With Ngrok Setup

This tool runs a magic TSL tunnel back to your machine as long as you keep it open in shell.

First download the executable from https://ngrok.com/download

You can test it from the examples on their download page. It creates a tunnel at a public URL back to an app running on your machine, only for the specified port. (Exit with Ctrl-C and the tunnel will be broken.)

(ASIDE: HOW SETUP NGROK FOREVER)
First download from https://ngrok.com/download and the `ngrok` executable may be in your Downloads folder, but won't be available to your shell.

You will need to make sure it is somewhere that will be picked up by your default shell. Suggestion for macOS:

Create a hidden folder at your home directory `~/.bin`.

(Or anywhere else you'd like, including a non-hidden folder. On macOS the operating system will give you a headache if you try to put it into root folders, like `/usr` and/or other system-level root folders like the `/Library` folders or other folders outside of your home or user account folder.)

Drag & drop the `ngrok` executable from your Downloads folder into this new hidden directory. Check to make sure your user can execute it by checking its mod flags with `chmod`

If you use either Bash or Zsh for your shell -- and you should know which you use -- add this to the end of your `.bash_profile` or `.zsrc` file:

`PATH="/Users/jason/.bin:$PATH"`

Replace 'jason' with your account name. Or wherever you'd to store the `ngrok` file. Reload the shell and test with

```
$ which ngrok
```

If NOT successful, you will see NO OUTPUT.
If successful, you should see the path to the ngrok file.

```
/Users/jason/.bin/ngrok
```

As well, when you run `ngrok` on its own you will see

```
$ ngrok
NAME:
   ngrok - tunnel local ports to public URLs and inspect traffic
...
```

as well as the basic `ngrok` help page.

If you've got this you are now free to run `ngrok` anywhere while in your shell.
(END OF ASIDE)

Back to development workflow, **after you have your local Rails server running**, open a terminal and do the following:

```
$> ngrok http 3000
```

Look for two "Forwarding" URLs with random subdomain strings for .ngrok.io
(The second one will be https)

This will open a public endpoint that we can use for our webhook. Do not close this tab! Copy the https url in there.
It will look something like `https://edbd2cc7d2fc.ngrok.io`

Go to Mux.com and go into your settings. Settings > Webhooks API > Select your environment, and
set the webhook url to be the https ngrok URL from above + `/mux/webhook` (something _like_ `https://edbd2cc7d2fc.ngrok.io/mux/webhook`) by adding `/mux/webhook` to the
end of your ngrok tunnel.

### 6. Setup Broadcaster

"Broadcaster" is the adorable name we give to the Electron.js app that we have for streamers. It's in the folder
`broadcaster` (duh) and you can start it up with a quick `yarn start`.

Look in `broadcaster/conig/main.js` for configuration.
Change the session key for 'localhost' to the same key that your browser generates for `_veue_session`. Do not edit the 'stage' setting.
Node will pick up the stage from the session key established in your browser.

Then, from root of the project in a new shell

```
cd braodcaster/
yarn install
yarn start
```

An Electron app will launch. By default, the app opens with the Chrome debugging tools shown, making the layout look awkward. Close them using the X in the top-right of the window.

### 7. Webpacker (OPTIONAL)

To speed up development of TS files
(from root of the project in a new shell)

```
./bin/webpack-dev-server
```

### 8. sidekiq

To run background jobs
(from root of the project in a new shell)
run

```
sidekiq
```

Sidekiq is using Redis. In case your Redis instance might be clogged up with Sidekiq jobs from other Rails apps (that you may perhaps also be developing at localhost), use `redis-cli FLUSHALL` to clear out the contents of your Redis cache.
>>>>>>> small fixes to README for new dev

### Putting it all together...

Start up your Rails development server as you normally would!

`rails s`

You should be able to load the site on `localhost:3000` or alternately, you should be able to see it
if you load your ngrok hostname.

Start at http://localhost:3000/videos

In development, no real phone number is necessary because the verification code is displayed immediately to you on the modal window.

Continue to pick a display name

http://localhost:3000/videos

### Troubleshooting

#### `bundle install` issues

If you get a crash when running `gem install puma -v '4.3.5' --source 'https://rubygems.org/'`, this strange Puma build error has been reported on macOS Catalina and Big Sur

```
puma_http11.c:203:22: error: implicitly declaring library function 'isspace' with type 'int (int)' [-Werror,-Wimplicit-function-declaration]
```

to fix run

```
gem install puma:4.3.5 -- --with-cflags="-Wno-error=implicit-function-declaration"
```

Then re-run `bundle install` and it should run through cleanly now.

for more info see https://thoughtfulapps.com/articles/rails/puma-implicitly-declaring-library-function-error

#### deskie

change into `deskie/`

If when running `yarn start`, you see this error, you are booting into the Production Node env.

TO FIX: You must reverse engineer the session from your browser.

see deskie.js line 22 environments
be sure to change the session key for localhost (not 'stage') to the one you retrieve from your browser (see step #6).

```
Error: ERR_TOO_MANY_RETRIES (-375) loading 'https://beta.veuelive.com/broadcasts'
    at rejectAndCleanup (electron/js2c/browser_init.js:5980:21)
    at WebContents.failListener (electron/js2c/browser_init.js:5990:11)
    at WebContents.emit (events.js:203:13) {
  errno: -375,
  code: 'ERR_TOO_MANY_RETRIES',
  url: 'https://beta.veuelive.com/broadcasts'
}
```

#### MuxRuby::UnauthorizedError

```
MuxRuby::UnauthorizedError in BroadcastsController
```

### TEST SUITE

Decorator Specs

Factories with FactoryBot

Unit specs (see `models/`)

System specs
