import ujs from "@rails/ujs";
// Load our SCSS
import "../style/application.scss";

import "controllers";
import "simplebar";
import "simplebar/dist/simplebar.css";
import "@github/time-elements";

// Sidecar loads our ViewComponent scss files.
import "../components";

ujs.start();

// including images from javascript folder
require.context("../images", true);

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();
