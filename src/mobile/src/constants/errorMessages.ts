import * as SharedErrorMessages from '../../../shared/constants/error-messages';

export const MOBILE_ERROR_MESSAGES = {
  NETWORK_ERROR: "Unable to connect to the server. Please check your internet connection and try again.",
  PUSH_NOTIFICATION_REGISTRATION_FAILED: "Failed to register for push notifications. Please try again later.",
  BIOMETRIC_AUTH_FAILED: "Biometric authentication failed. Please use your password to log in.",
  CAMERA_PERMISSION_DENIED: "Camera permission is required to use this feature. Please enable it in your device settings.",
  LOCATION_PERMISSION_DENIED: "Location permission is required to use this feature. Please enable it in your device settings.",
  APP_UPDATE_REQUIRED: "A new version of the app is available. Please update to continue using Mint Replica.",
  DEVICE_NOT_SUPPORTED: "Your device is not supported. Please check the minimum requirements for the Mint Replica app.",
  SYNC_FAILED: "Failed to sync your data. Please try again later.",
  OFFLINE_MODE_UNAVAILABLE: "Offline mode is currently unavailable. Please connect to the internet to use this feature."
};

export const ERROR_MESSAGES = {
  ...SharedErrorMessages,
  ...MOBILE_ERROR_MESSAGES
};

// Human tasks:
// TODO: Review and update mobile-specific error messages to ensure they cover all possible error scenarios in the mobile app
// TODO: Ensure error messages are consistent with the app's tone and branding guidelines
// TODO: Consider adding localization support for error messages if multi-language support is planned