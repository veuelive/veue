export interface Environment {
  hostname: string;
  auth?: string;
  showUnhandledExceptionDialog: boolean;
}

export const environments = {
  production: {
    hostname: "https://www.veuelive.com",
    showUnhandledExceptionDialog: false,
  },
  stage: {
    hostname: "https://beta.veuelive.com",
    auth: "tlhd",
    showUnhandledExceptionDialog: true,
  },
  localhost: {
    hostname: "http://localhost:3000",
    showUnhandledExceptionDialog: true,
  },
} as Record<string, Environment>;

export function loadEnvironmentSettings(): Environment {
  return environments[process.env.ENVIRONMENT || "production"];
}
