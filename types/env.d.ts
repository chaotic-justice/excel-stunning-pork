declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SITE_URL: string;
      NEXTAUTH_URL: string;
      AUTH_SECRET: string;
      NEXT_API_ENDPOINT: string;
      NEXT_GRAPHQL_ENDPOINT: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
    }
  }
}

export {}
