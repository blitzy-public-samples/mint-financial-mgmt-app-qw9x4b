import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Human tasks:
// 1. Create the App.tsx file with the root component of the application
// 2. Ensure app.json is properly configured with the correct app name