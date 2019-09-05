export function getClientConfig() {
  const isProd = process.env.NODE_ENV === "production";

  return {
    IS_PROD: isProd,
    API_URL: isProd ? "https://www.newsfeeder.io" : "http://localhost:3000",
    STRIPE_PK: isProd ? "" : "",
  };
}
