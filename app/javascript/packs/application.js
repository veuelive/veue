import ujs from "@rails/ujs";
// Load our SCSS
import "../style/application.scss";

import "controllers";
import "simplebar";
import "simplebar/dist/simplebar.css";
import "@github/time-elements";

// Sidecar loads our ViewComponent scss files.
import "../components";

import logdna from "@logdna/browser";

ujs.start();

// including images from javascript folder
require.context("../images", true);

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();

if (process.env.NODE_ENV === "production") {
  const LOGDNA_INGESTION_KEY = process.env.LOG_DNA_KEY;

  const user = document.querySelector("[data-user-name]");

  let userName;
  let userId;

  if (user != null) {
    userName = user.dataset.userName;
    userId = user.dataset.userId;
  }

  logdna.init(LOGDNA_INGESTION_KEY).addContext({
    user: {
      userName,
      userId,
    },
  });
}
