export const config = {
  appSecret: process.env.APP_SECRET,

  appUrl: process.env.APP_URL,

  mongoUri: process.env.MONGO_URL,

  sendGridApiKey: process.env.API_KEY,

  port: isNaN(Number(process.env.PORT)) ? 3000 : Number(process.env.PORT),
};
