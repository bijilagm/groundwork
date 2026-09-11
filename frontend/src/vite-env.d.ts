/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Absolute base URL of the deployed backend API (empty in dev; uses the Vite proxy). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
