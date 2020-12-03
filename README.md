# Veue

### Quick Links

- Production:

  - [Site](https://www.veuelive.com)
  - [SideKiq UI](https://www.veuelive.com/_/sidekiq)
  - [Render Service](https://dashboard.render.com/web/srv-bukoj3m9ph1hqurcua20)
  - [APM](https://appsignal.com/veue/sites/5f1b3af314ad66221c331630/dashboard)
  - [Logs](https://app.logdna.com/e4202f546b/logs/view/560b2cfe31)

- Stage
  - [Site](https://stage.veuelive.com)
  - [SideKiq UI](https://stage.veuelive.com/_/sidekiq)
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

### 3. Redis

For Redis installation, visit this page: https://redis.io/topics/quickstart

### 4. Ruby, Rails & Database Setup

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

```bash
$ which ngrok
```

If NOT successful, you will see NO OUTPUT.
If successful, you should see the path to the ngrok file.

```bash
/Users/jason/.bin/ngrok
```

As well, when you run `ngrok` on its own you will see

```bash
$ ngrok
NAME:
   ngrok - tunnel local ports to public URLs and inspect traffic
...
```

as well as the basic `ngrok` help page.

If you've got this you are now free to run `ngrok` anywhere while in your shell.

Alternatively, you can install Ngrok as a global NPM package:

```bash
npm install -g ngrok --unsafe-perm

# OR

yarn global add ngrok
```

** END OF ASIDE **

Back to development workflow, **after you have your local Rails server running**, open a terminal and do the following:

```bash
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

From root of the project in a new shell

```bash
cd broadcaster/
yarn install
yarn start
```

An Electron app will launch. By default, the app opens with the Chrome debugging tools shown, making the layout look awkward. Close them using the X in the top-right of the window.

### 7. Webpacker (OPTIONAL)

To speed up development of TS files
(from root of the project in a new shell)

```bash
./bin/webpack-dev-server
```

### 8. sidekiq

During development, you do not need to run a full redis+sidekiq instance, but if you are doing advanced development, it might be useful!

To run background jobs
(from root of the project in a new shell)
run

```bash
sidekiq
```

Sidekiq is using Redis. In case your Redis instance might be clogged up with Sidekiq jobs from other Rails apps (that you may perhaps also be developing at localhost), use `redis-cli FLUSHALL` to clear out the contents of your Redis cache.

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

```bash
puma_http11.c:203:22: error: implicitly declaring library function 'isspace' with type 'int (int)' [-Werror,-Wimplicit-function-declaration]
```

to fix run

```bash
gem install puma:4.3.5 -- --with-cflags="-Wno-error=implicit-function-declaration"
```

Then re-run `bundle install` and it should run through cleanly now.

for more info see https://thoughtfulapps.com/articles/rails/puma-implicitly-declaring-library-function-error

#### deskie

change into `deskie/`

If when running `yarn start`, you see this error, you are booting into the Production Node env.

TO FIX: You must reverse engineer the session from your browser.

see main.js auth
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

To run the test suite simply run:

`rails spec`

Decorator Specs

Factories with FactoryBot

Unit specs (see `models/`)

System specs

### Adding data to the Database in development

In order to add data to the database, you must have a `.sql` or `.psql`
text file. You may even receive a file in `.sql.gz` or `.psql.gz` format
which just means its gzipped. If you're on a Mac or Linux here are the
following steps you need to take, assuming your database is all setup
and migrated.

1. Download the file to your local system.

2. Copy the file into the `tmp` directory, IE:

`cp ~/Downloads/database_stuff.sql.gz tmp/database_info.sql.gz`

3. Ungzip the file, this will strip the `.gz` extension.

`gzip -d tmp/database_info.sql.gz`

4. Restore via `psql` in the terminal.

```bash
        # DB name            DB_FILE
psql veue_development < tmp/database_info.sql
```

And you should be setup and ready to go!

#### Checks (your PR will fail without these)

## Rspec

## Prettier — FOR TYPESCRIPT/JAVASCRIPT

Install with npm or yarn: https://prettier.io/docs/en/install.html

(Ignore the instructions about creating `.prettierrc.json` which already exists in the repo. Take a look at it but don't edit it.)

To run on the entire codebase, run
`yarn prettier .`

To run on only one file, run

`yarn prettier app/javascript/controllers/my_controller.ts`

However, running prettier this way _doesn't actually change or prettify your files_. All it does is give you warnings.

To have prettier actually re-write your files, you'll want to run it with the `--write` flag.

`yarn prettier --write app/javascript/controllers/my_controller.ts`

You'll want to do this for any Typescript file or spec you add or modify.

In this app the check is run with this command, so it is run against all JS/TS files in `app/` and also `spec/`
`yarn prettier -c app spec`

## Rubocop — For Ruby

Make sure any Ruby code you add or modify passes Rubocop.

You do this by running `rubocop` on your console. To tell Rubocop to correct your syntax for you use `rubocop -A`

The full docs are here: https://docs.rubocop.org/rubocop/1.3/index.html
