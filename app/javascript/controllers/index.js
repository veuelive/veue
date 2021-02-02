// Load all the controllers within this directory and all subdirectories.
// Controller files must be named *_controller.js.

import { Application } from "stimulus";
import { definitionsFromContext } from "stimulus/webpack-helpers";
import appsignal from "../helpers/integrations/appsignal";
import { installErrorHandler } from "@appsignal/stimulus";

const application = Application.start();
installErrorHandler(appsignal, application);
const context = require.context("controllers", true, /_controller\.ts$/);
application.load(definitionsFromContext(context));
