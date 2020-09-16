- ##VEUE-77 - @hcatlin - 09-16-2020

  - ##ADDED
    - New Capybara browser setting called `media_browser` that allows testing of things like webcams and captures
    - `IpcMockConcern` exists in non-prod environments to see Broadcast working
    - Created new `ipcRenderer` object that mocks the Electron IPCRenderer in non-node environments for testing and dev
    - `User` objects now automatically are setup for streaming on attempt to stream
    - Created a new System spec called `Broadcast` to help the rails side of testing the Broadcast system

- ##VEUE-67 - @hcatlin - 09-15-2020

  - ##DEPENDENCIES
    - `node-fetch` upgraded to 2.6.1 to address [CVE-2020-15168](https://github.com/advisories/GHSA-w7rc-rwvf-8q5r)
    - `rails` upgraded to 6.0.3.3 to address [ CVE-2020-15169](https://github.com/advisories/GHSA-cfjv-5498-mph5)

- ##VEUE-66 - @hcatlin - 09-14-2020
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
