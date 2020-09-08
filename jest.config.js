module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["spec/javascript"],
  moduleDirectories: ["node_modules", "app/javascript"],
  setupFiles: ["./spec/javascript/setup.ts"],
};
