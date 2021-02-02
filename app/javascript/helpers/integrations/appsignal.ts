import Appsignal from "@appsignal/javascript";
import { AppConfig } from "helpers/app_config";
import { plugin } from "@appsignal/plugin-breadcrumbs-console";

const appsignal = new Appsignal({
  key: AppConfig.appsignal?.key,
  revision: AppConfig.veue.revision,
});
appsignal.use(plugin());
export default appsignal;
