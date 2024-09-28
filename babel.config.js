// Root-level Babel configuration file for the Mint Replica project
// This file specifies the Babel presets and plugins used to transpile JavaScript code
// across the entire project, including both web and mobile applications.

module.exports = {
  presets: [
    ["@babel/preset-env", { "targets": { "node": "current" } }],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  plugins: [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "react-native-reanimated/plugin"
  ]
};

// Human tasks:
// 1. Review and update Babel configuration if needed for any specific project requirements (Optional)
// 2. Ensure all necessary Babel plugins are installed in the project's package.json (Required)