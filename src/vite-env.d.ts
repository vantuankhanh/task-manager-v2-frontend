/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCKET_IO_URL: string;
  readonly VITE_BASE_URL: string;
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
