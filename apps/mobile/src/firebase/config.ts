// Firebase runtime yapilandirmasi (ADR-020 / ADR-021).
//
// @react-native-firebase varsayilan app'i native tarafta google-services.json
// (Android) / GoogleService-Info.plist (iOS) dosyalarindan otomatik baslatir.
// Bu modul yalnizca gelistirme ortaminda yerel emulator suite'ine baglanir.
//
// Native modul kullanildigi icin Expo development build ZORUNLUDUR; Expo Go
// desteklenmez (ADR-002 amendment / ADR-020 Bolum 16).

import { Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

// React Native runtime'da global olarak tanimli __DEV__ bayragi.
declare const __DEV__: boolean;

// Android emulator host makineye 10.0.2.2 uzerinden erisir; iOS simulator localhost kullanir.
const EMULATOR_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Emulator port'lari — firebase.json ile birebir ayni olmalidir.
const AUTH_EMULATOR_PORT = 9099;
const FIRESTORE_EMULATOR_PORT = 8080;
const FUNCTIONS_EMULATOR_PORT = 5001;

// @MX:NOTE: [AUTO] Idempotent emulator baglantisi; herhangi bir adapter SDK'ya dokunmadan ONCE bir kez cagrilmali (App.tsx)
let emulatorsConnected = false;

/**
 * Auth, Firestore ve Functions SDK'larini yerel emulator suite'ine yonlendirir.
 * Production build'de no-op'tur ve Fast Refresh tekrar calistirmalarina karsi idempotenttir.
 */
export function connectFirebaseEmulators(): void {
  if (!__DEV__ || emulatorsConnected) return;
  emulatorsConnected = true;

  auth().useEmulator(`http://${EMULATOR_HOST}:${AUTH_EMULATOR_PORT}`);
  firestore().useEmulator(EMULATOR_HOST, FIRESTORE_EMULATOR_PORT);
  functions().useEmulator(EMULATOR_HOST, FUNCTIONS_EMULATOR_PORT);
}
