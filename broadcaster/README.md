# Veue Broadcaster

## Introduction

This is electron.js based desktop application for doing live streaming.

## MacOS Privileges Required

This application requires access to your camera & microphone when it gets booted for the first time. If you didn't provide
privileges at first boot, you can set them from **System Preferences** => **Security & Privacy Settings**.

If you want to reset these privileges during development you can use **tccutil**.

Here is the command to reset privileges in development environment for Terminal itself:

`tccutil reset All com.apple.Terminal`

or you can use absolute path depending upon your directory structure:

`/usr/bin/tccutil reset All com.apple.Terminal`

## Internal Keyboard Shortcuts for Debugging

### Debug Canvas

Ctrl + Cmd + Shift + D

Will display the hidden canvas that show you the layout of the video feed from the broadcaster.

### Test Pattern

Ctrl + Cmd + Shift + P

This will navigate the browser to the "Test Pattern" that you can use in conjunction with the
Debug Canvas to ensure that the canvas is properly setup.

### Alpha Channel

Ctrl + Cmd + Shift + A

This will prompt you to choose a release channel
