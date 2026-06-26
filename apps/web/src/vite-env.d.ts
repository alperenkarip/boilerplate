/// <reference types="vite/client" />

// Typed environment variables (Firebase web SDK config + emulator toggle).
// Keeps `import.meta.env.VITE_FIREBASE_*` strongly typed instead of `any`.
interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  /** Optional Cloud Functions region (defaults to us-central1 when unset). */
  readonly VITE_FIREBASE_FUNCTIONS_REGION?: string;
  /** When 'true', force emulator wiring; when 'false', force it off. Defaults to DEV. */
  readonly VITE_FIREBASE_USE_EMULATOR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
