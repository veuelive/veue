"use strict";
import {
  app,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import config from "./config";
import { aboutMenuItem, appMenu, is, openUrlMenuItem } from "electron-util";
import * as path from "path";

const showPreferences = () => {
  // Show the app's preferences here
};

const helpSubmenu = [
  openUrlMenuItem({
    label: "Website",
    url: "https://www.veuelive.com/-/help",
  }),
] as Array<MenuItemConstructorOptions>;

if (!is.macos) {
  helpSubmenu.push(
    {
      type: "separator",
    },
    aboutMenuItem({
      icon: path.join(__dirname, "static", "icon.png"),
      text: "Created by Veue",
    })
  );
}

const logoutMenuItem = {
  label: "Logout",
  click() {
    config.delete("sessionToken");
    app.relaunch();
    app.quit();
  },
};

const debugSubmenu = [
  {
    label: "Show Settings",
    click() {
      config.openInEditor();
    },
  },
  {
    label: "Show App Data",
    click() {
      shell.openPath(app.getPath("userData"));
    },
  },
  {
    type: "separator",
  },
  {
    label: "Delete Settings",
    click() {
      config.clear();
      app.relaunch();
      app.quit();
    },
  },
  {
    label: "Delete App Data",
    click() {
      shell.moveItemToTrash(app.getPath("userData"));
      app.relaunch();
      app.quit();
    },
  },
] as Array<MenuItemConstructorOptions>;

const macosTemplate = [
  appMenu([logoutMenuItem]),
  {
    role: "editMenu",
  },
  {
    role: "help",
    submenu: helpSubmenu,
  },
] as Array<MenuItemConstructorOptions>;

// Linux and Windows
const otherTemplate = [
  {
    role: "fileMenu",
    submenu: [
      logoutMenuItem,
      {
        type: "separator",
      },
      {
        type: "separator",
      },
      {
        role: "quit",
      },
    ],
  },
  {
    role: "editMenu",
  },
  {
    role: "help",
    submenu: helpSubmenu,
  },
] as Array<MenuItemConstructorOptions>;

const template = process.platform === "darwin" ? macosTemplate : otherTemplate;

template.push({
  label: "Debug",
  submenu: debugSubmenu,
});

export default Menu.buildFromTemplate(template);
