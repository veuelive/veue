import ujs from "@rails/ujs";
// Load our SCSS
import "../style/application.scss";

import "channels";
import "controllers";
import "simplebar";
import "simplebar/dist/simplebar.css";
import "@github/time-elements";

ujs.start();

// including images from javascript folder
require.context("../images", true);

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();
