const { getDefaultConfig } = require('expo/metro-config');

// Üst klasörde bulunan diğer Expo projesinin expo-router paketinin bu
// React Navigation projesini engellemesini önler.
process.env.EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK = '1';

const config = getDefaultConfig(__dirname);

module.exports = config;
