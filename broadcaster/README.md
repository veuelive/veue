# Veue Broadcaster

## Introduction

This is electron.js based desktop application for doing live streaming.

## Privileges Required

This application requires access to your camera & microphone when it gets booted for the first time. If you didn't provide
privileges at first boot, you can set them from **System Preferences** => **Security & Privacy Settings**.

If you want to reset these privileges during development you can use **tccutil**.

Here is the command to reset privileges in development environment for Terminal itself:

`tccutil reset All com.apple.Terminal`

or you can use absolute path depending upon your directory structure:

`/usr/bin/tccutil reset All com.apple.Terminal`
