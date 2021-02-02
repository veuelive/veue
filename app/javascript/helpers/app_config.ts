// This is populated in the HTML, and comes from code in `app/helpers/application_helper.rb`

interface AppConfig {
  env: string;
  origin: string;
  veue: {
    env: string;
    revision: string;
    branch: string;
  };
  service: {
    id: string;
    name: string;
    pod: string;
  };
  appsignal: {
    key: string;
  };
}

export const AppConfig = globalThis.appConfig as AppConfig;

export const origin = AppConfig.origin || document.location.origin;
