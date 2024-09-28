// Metro configuration for React Native
// https://github.com/facebook/react-native

const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig();

  // Modify the default configuration as needed
  const config = {
    ...defaultConfig,
    // Add any custom configurations here
  };

  return config;
})();

// Human tasks:
// TODO: Review and adjust Metro configuration based on project-specific needs (Optional)
// TODO: Ensure compatibility with any custom plugins or transformers used in the project (Required)