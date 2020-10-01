import ujs from "@rails/ujs";
ujs.start();

import Turbolinks from "turbolinks";
Turbolinks.start();

// including images from javascript folder
require.context("../images", true);

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();

// Load our SCSS
import "../style/application.scss";

import "channels";
import "controllers";
import "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import "simplebar/dist/simplebar.css";
