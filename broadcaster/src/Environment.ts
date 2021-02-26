export interface Environment {
  hostname: string;
  auth?: string;
  showUnhandledExceptionDialog: boolean;
  defaultReleaseChannel: string;
}

export const environments = {
  production: {
    hostname: "https://www.veue.tv",
    showUnhandledExceptionDialog: false,
    defaultReleaseChannel: "latest",
  },
  stage: {
    hostname: "https://preshow.veuelive.com",
    auth: "mohawk",
    showUnhandledExceptionDialog: true,
    defaultReleaseChannel: "beta",
  },
  localhost: {
    hostname: "http://localhost:3000",
    showUnhandledExceptionDialog: true,
    defaultReleaseChannel: "alpha",
  },
} as Record<string, Environment>;

export default environments[process.env.ENVIRONMENT || "production"];
