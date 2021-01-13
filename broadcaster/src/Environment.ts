export interface Environment {
  hostname: string;
  auth?: string;
  showUnhandledExceptionDialog: boolean;
  defaultReleaseChannel: string;
}

export const environments = {
  production: {
    hostname: "https://www.veuelive.com",
    showUnhandledExceptionDialog: false,
    defaultReleaseChannel: "latest",
  },
  stage: {
    hostname: "https://beta.veuelive.com",
    auth: "tlhd",
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
