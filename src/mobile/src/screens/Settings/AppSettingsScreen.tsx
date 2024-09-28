import React, { useState, useEffect } from 'react';
import { View, Text, Switch, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../constants/theme';
import { RootState } from '../../store';
import { updateSettings } from '../../store/slices/settingsSlice'; // Assuming we have a settingsSlice

const AppSettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const currentSettings = useSelector((state: RootState) => state.settings);

  const [notificationsEnabled, setNotificationsEnabled] = useState(currentSettings.notificationsEnabled);
  const [darkModeEnabled, setDarkModeEnabled] = useState(currentSettings.darkModeEnabled);
  const [currency, setCurrency] = useState(currentSettings.currency);
  const [language, setLanguage] = useState(currentSettings.language);

  useEffect(() => {
    // Update local state if Redux state changes
    setNotificationsEnabled(currentSettings.notificationsEnabled);
    setDarkModeEnabled(currentSettings.darkModeEnabled);
    setCurrency(currentSettings.currency);
    setLanguage(currentSettings.language);
  }, [currentSettings]);

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleToggleDarkMode = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const handleSaveSettings = () => {
    const updatedSettings = {
      notificationsEnabled,
      darkModeEnabled,
      currency,
      language,
    };
    dispatch(updateSettings(updatedSettings));
    // TODO: Implement actual logic for saving settings to the backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>App Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggleNotifications}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Dark Mode</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={handleToggleDarkMode}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Currency</Text>
        <Input
          value={currency}
          onChangeText={handleCurrencyChange}
          placeholder="Enter currency"
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Language</Text>
        <Input
          value={language}
          onChangeText={handleLanguageChange}
          placeholder="Enter language"
        />
      </View>

      <Button title="Save Settings" onPress={handleSaveSettings} />
      <Button title="Logout" onPress={logout} />

      {/* TODO: Add more specific settings based on the final list of features */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.text,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
});

export default AppSettingsScreen;

// TODO: Implement proper error handling for settings updates