// Jest 29.x mobile test config (ADR-008)
// expo-jest kurulumu sonrasi aktiflesecek

/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)',
  ],
  setupFilesAfterFramework: ['./src/test/setup.ts'],
  testMatch: ['**/*.test.{ts,tsx}'],
};
