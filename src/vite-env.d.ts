/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "iam" when VTK IAM signs people in; anything else is the legacy sign-in. */
  readonly VITE_AUTH_MODE?: string;
  readonly VITE_SOCKET_IO_URL: string;
  readonly VITE_BASE_URL: string;
  readonly VITE_URL_LOGIN: string;
  readonly VITE_URL_REFRESH_TOKEN: string;
  readonly VITE_URL_SEND_VERIFY_CODE: string;
  readonly VITE_URL_VALIDATE_CODE: string;
  readonly VITE_URL_CREATE_PASSWORD: string;
  readonly VITE_URL_GET_EMPLOYEE: string;
  readonly VITE_URL_CREATE_EMPLOYEE: string;
  readonly VITE_URL_UPDATE_EMPLOYEE: string;
  readonly VITE_URL_GET_TASK: string;
  readonly VITE_URL_CREATE_TASK: string;
  readonly VITE_URL_UPDATE_TASK: string;
  readonly VITE_URL_GET_MESSAGE: string;
  readonly VITE_URL_CREATE_MESSAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
