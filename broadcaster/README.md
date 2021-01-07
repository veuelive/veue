# Veue Broadcaster

## Introduction

This is electron.js based desktop application for doing live streaming.

## Privileges Required

This application require access for camera & microphone when it gets booted for first time. If you didn't provided
privileges at first boot, you can set them from **System Preferences Pane** => **Security & Privacy Settings**.

If you want to reset these privileges during development you can use **tccutil**.

Here is the command to reset privileges in development environment for Terminal itself:

`tccutil reset All com.apple.Terminal`

or you can use absolute path depending upon your directory structure:

`/usr/bin/tccutil reset All com.apple.Terminal`
