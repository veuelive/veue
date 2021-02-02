import ujs from "@rails/ujs";
// Load our SCSS
import "../style/application.scss";

import "controllers";
import "simplebar";
import "simplebar/dist/simplebar.css";

ujs.start();

// including images from javascript folder
require.context("../images", true);

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();
