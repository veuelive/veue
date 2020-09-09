import ujs from "@rails/ujs";
ujs.start();

import Turbolinks from "turbolinks";
Turbolinks.start();

// import ActiveStorage from "@rails/activestorage";
// ActiveStorage.start();

// Load our SCSS
import "../style/application.scss";

import "channels";
import "controllers";
