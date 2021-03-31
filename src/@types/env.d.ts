declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** public path for assets, this includes a trailing slash */
      PUBLIC_PATH: string;
    }
  }
}

export {};
