declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development';
      PORT?: string;
      PWD: string;
    }
  }
}

export {};
