require('dotenv').config();

module.exports = {
  COGNITO_REDIRECT_URI: process.env.COGNITO_REDIRECT_URI,
  PORT: parseInt(process.env.PORT, 10) || undefined,

  // Splunk logging variables
  SPLUNK_URL: process.env.SPLUNK_URL,
  SPLUNK_TOKEN: process.env.SPLUNK_TOKEN,
  SPLUNK_SOURCE: process.env.SPLUNK_SOURCE,
  SPLUNK_SOURCETYPE: process.env.SPLUNK_SOURCETYPE,
  SPLUNK_INDEX: process.env.SPLUNK_INDEX,

  TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
  // TWITTER_CLIENT_SECRET: process.env.TWITTER_CLIENT,
  TWITTER_API_URL: process.env.TWITTER_API_URL,
  TWITTER_AUTHORIZE_URL: process.env.TWITTER_AUTHORIZE_URL,

};
