- ##[VEUE-57](https://app.clickup.com/t/8444384/VEUE-57)
  @Sirbuland - 2020-10-06

  - ###ADDED
    - Functionality for follow streamer on live video
    - Separated streamer profile view in new partial

- ##[VEUE-126](https://app.clickup.com/t/8444384/VEUE-126)
  @hcatlin - 2020-10-04

  - ###ADDED

    - Added a timecode encoder that takes the current time of the stream (relative to the start of the stream) and
      encodes that information as a color-bar into the bottom right hand side of the video feed.
    - Build a timecode decoder that can take a canvas and pull out the timecode to allow audience members to sync up their experiences
    - Multi-environment support for Deskie
    - Centralized the storage of various standard sizes into a `Sizes` Javascript class

  - ###CHANGED
    - secondaryView (webcam) is now 360px wide instead of 320
    - Replaced our test .ts video file with a lower quality snipped that includes the timecode and new size

- 10-02-2020 - Video Height Bugfix [VEUE-121](https://app.clickup.com/t/8444384/VEUE-121) - @hcatlin

- 10-02-2020 - Bugfix [VEUE-118](https://app.clickup.com/t/8444384/VEUE-118) - Use native HLS with Safari to have streaming work

* ##[VEUE-105](https://app.clickup.com/t/8444384/VEUE-105)
  @hcatlin - 2020-10-01
  - ###CHANGED
    - Broke up the video.scss file
    - Built mobile sized views
    - Built hide/show chat in Mobile size
    - Moved "StreamerProfile" to be below the video
    - The secondary panel now disappears when in mobile size

- ##[VEUE-97](https://app.clickup.com/t/8444384/VEUE-97)
  @hcatlin - 2020-09-28
  - ###ADDED
    - Time now shows on the broadcasters screen
    - Got the "Broadcast" system test mocked a lot more so that it actually thinks it's broadcasting

* ##[VEUE-99](https://app.clickup.com/t/8444384/VEUE-99)
  @hcatlin - 2020-09-28

  - ###ADDED
    - Time Display helper functions like `displayTime(seconds)` to output to something like `01:32:45`
    - Tests that ACTUALLY _play_ a video, and embedded a simple video playlist into the `public/_tests` folder
      for both live and not live streams
    - The main element of this ticket... displaying the time counter when the audience is watching a VOD stream
  - ###CHANGED
    - We no longer use the mux_playback_id to figure out what video stream to select, and instead we have a
      column in the `videos` table called `hls_url` that has the HLS link.
    - Created a better state handler for the `audience_view_controller.ts` to make the "video playing"
      `system/vod_audience_spec.rb` tests more reliable.

* ##[VEUE-83](https://app.clickup.com/t/8444384/VEUE-83)
  @hcatlin - 2020-09-25

  - ###ADDED
    - Broadcast controller is now a plural resource, and streamers stream _to_ the broadcast/video_id
    - New `VideoMixer` class to control painting / frame logic for broadcast
    - New `StreamCapturer` JS class to control MediaRecorder and broadcast
    - Added ability to stop() the stream
  - ###CHANGED
    - Video's are CREATED before the stream starts– Streamers can have 1 or 0 "pending" live videos
    - AddressBar Stimulus Controller is now a submodule of "broadcast"
    - `did-navigate` events send a `page_visit` POST to the broadcast controller
    - Broke out most of the functionality of Broadcast Controller into `VideoMixer` and `StreamCapturer`

* ##[VEUE-82](https://app.clickup.com/t/8444384/VEUE-82)
  @hcatlin - 2020-09-17

  - ###ADDED
    - New `VideoEvent` model to capture different types of events in the browser that we can play back
    - JsonValidator to help handle JSONB fields and their schemas
  - ###CHANGED
    - Users should no longer be able to chat into "non-live" videos

* 09-16-2020 - Bugfix [VEUE-81](https://app.clickup.com/t/8444384/VEUE-81) - @hcatlin

* ##[VEUE-77](https://app.clickup.com/t/8444384/VEUE-77)
  @hcatlin - 2020-09-16

  - ###ADDED
    - New Capybara browser setting called `media_browser` that allows testing of things like webcams and captures
    - `IpcMockConcern` exists in non-prod environments to see Broadcast working
    - Created new `ipcRenderer` object that mocks the Electron IPCRenderer in non-node environments for testing and dev
    - `User` objects now automatically are setup for streaming on attempt to stream
    - Created a new System spec called `Broadcast` to help the rails side of testing the Broadcast system

* ##[VEUE-32](https://app.clickup.com/t/8444384/VEUE-32)
  @Sirbuland - 2020-09-16
  - ###ADDED
    - SVG handling using inline_svg gem.
    - Include svgs as icons in place of images.
    - Created a custom type for including svg files in typescript using import e.g: `import userSVG from '../images/user.svg'`.
    - Overall revamp of video page styling.
    - Added products section.
    - Added player buttons.

- [VEUE-67](https://app.clickup.com/t/8444384/VEUE-67)
  @hcatlin - 2020-09-15

  - ###DEPENDENCIES
    - `node-fetch` upgraded to 2.6.1 to address [CVE-2020-15168](https://github.com/advisories/GHSA-w7rc-rwvf-8q5r)
    - `rails` upgraded to 6.0.3.3 to address [ CVE-2020-15169](https://github.com/advisories/GHSA-cfjv-5498-mph5)

- ##[VEUE-66](https://app.clickup.com/t/8444384/VEUE-66)
  @hcatlin - 2020-09-14
  - ###ADDED
    - "System" tests that use chrome for testing and are now configured
    - Created a new flow for user authentication via phone number
    - `.eslintcache` is now in `.gitignore`
    - New! Default font of Nunito! Mapped in SCSS to `font.$nunito`
    - new helpers in the `SecureFetch API` that allow you to post `<form>` tags directly to data objects, OR you can pass in a Javascript object and it will get mapped to a FormData object automatically. See: `postForm`, `putForm`
    - Created a `PhoneNumberValidator` for ActiveRecord
  - ###CHANGED
    - the `secureFetch()` API that we use internally only warns to console if there is no CSRF token in the `<head>`, instead of erroring, as this was causing Browser tests to fail
    - our SCSS `color.$purple` is now it's proper name of `color.$cornflower`
    - Wherever we were using `user.username.capitalize` please use `user.display_name`
    - `User#has_many :mux_live_streams` is now nullify on destroy
  - ###DEPENDENCIES
    - REMOVED `devise` gem
    - ADDED `lockbox` gem for easy field-level encryption where needed for User privacy
    - ADDED `blind_index` gem for easy searching of encrypted fields
    - ADDED `phone` gem for parsing of phone numbers
    - ADDED `intl-tel-input` npm package for great Phone Number Input boxes
    - UPGRADED `webpacker` gem to deal with some bugs
  - ### REMOVED
    - All traces of Devise
    - All traces of WCS
    - Unused Decorator stubs for controllers unlikely to use them