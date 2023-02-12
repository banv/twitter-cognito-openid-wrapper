const axios = require('axios');
const {
  TWITTER_CLIENT_ID,
  COGNITO_REDIRECT_URI,
  TWITTER_API_URL,
  TWITTER_AUTHORIZE_URL
} = require('./config');
const logger = require('./connectors/logger');

const getApiEndpoints = (
  apiBaseUrl = TWITTER_API_URL,
) => ({
  userDetails: `${apiBaseUrl}/2/users/me`,
  userEmails: `${apiBaseUrl}/1.1/account/verify_credentials.json?include_email=true`,
  oauthToken: `${apiBaseUrl}/2/oauth2/token`,
  oauthAuthorize: TWITTER_AUTHORIZE_URL,
});

const check = (response) => {
  logger.debug('Checking response: %j', response, {});
  if (response.data) {
    if (response.data.errors) {
      throw new Error(
        `Twitter API responded with a failure: ${response.data.errors}`
      );
    } else if (response.status === 200) {
      return response.data;
    }
  }
  throw new Error(
    `GitHub API responded with a failure: ${response.status} (${response.statusText})`
  );
};

const twitterGet = (url, accessToken) =>
  axios({
    method: 'get',
    url,
    headers: {
      // Accept: 'application/vnd.github.v3+json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

module.exports = (apiBaseUrl, loginBaseUrl) => {
  const urls = getApiEndpoints(apiBaseUrl, loginBaseUrl || apiBaseUrl);
  return {
    getAuthorizeUrl: (client_id, scope, state, response_type) =>
      `${urls.oauthAuthorize}?client_id=${client_id}&scope=${encodeURIComponent("tweet.read users.read")}&state=${encodeURIComponent(state)}&response_type=${response_type}&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${encodeURIComponent(COGNITO_REDIRECT_URI)}`,
    getUserDetails: (accessToken) =>
      twitterGet(urls.userDetails, accessToken).then(check),
    getUserEmails: (accessToken) =>
        twitterGet(urls.userEmails, accessToken).then(check),
    getToken: (code) => {
      const data = `client_id=${TWITTER_CLIENT_ID}&grant_type=authorization_code&code=${code}
      &redirect_uri=${encodeURIComponent(COGNITO_REDIRECT_URI)}&code_verifier=challenge`;

      logger.debug(
        'Getting token from %s with data: %j',
        urls.oauthToken,
        data,
        {}
      );

      return axios({
        method: 'post',
        url: urls.oauthToken,
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data,
      }).then(check);
    },
  };
};
