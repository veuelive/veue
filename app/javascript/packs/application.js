import ujs from "@rails/ujs";
ujs.start();

// including images from javascript folder
require.context("../images", true);

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();

// Load our SCSS
import "../style/application.scss";

import "controllers";
import "simplebar";
import "simplebar/dist/simplebar.css";
import "croppie";
import "croppie/croppie.css";
import "croppie/croppie.js";
