import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

// Initialize Cognito User Pool
const poolData = {
  UserPoolId: 'us-east-1_9CT9nGSrI',
  ClientId: '17l9e7dms24sgnlu022n19c5jn',
};

const userPool = new CognitoUserPool(poolData);

// Signup Function
export const signupUser = (username, password, email) => {
  const attributeList = [];

  const emailAttribute = new CognitoUserAttribute({
    Name: 'email',
    Value: email,
  });

  attributeList.push(emailAttribute);

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) {
      console.error('Error signing up:', err.message || JSON.stringify(err));
      return;
    }
    const cognitoUser = result.user;
    console.log('User name is', cognitoUser.getUsername());

    return cognitoUser.getUsername();
  });
};

export function confirmUserSignup(username, code) {
  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);
  let res = '';

  return cognitoUser.confirmRegistration(String(code), true, (err, result) => {
    if (err) {
      console.error(
        'Error confirming signup:',
        err.message || JSON.stringify(err)
      );
      res = err.message || JSON.stringify(err);
      return err.message || JSON.stringify(err);
    }

    console.log('User confirmed successfully:', result);
    res = result;
    return result;
  });
}

export const resendConfirmationCode = (username) => {
  const userData = {
    Username: username, // Email address used during sign-up
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  return cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      console.error(
        'Error resending confirmation code:',
        err.message || JSON.stringify(err)
      );
      return;
    }
    console.log('Resent confirmation code result:', result);
  });
};
// Sign-in Function
export function signinUser(username, password) {
  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const userData = {
    Username: username,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      console.log('Login successful');
      console.log('ID Token:', result.getIdToken().getJwtToken());
      console.log('Access Token:', result.getAccessToken().getJwtToken());
      console.log('Refresh Token:', result.getRefreshToken().getToken());
    },

    onFailure: (err) => {
      console.error('Login failed:', err.message || JSON.stringify(err));
    },
    mfaSetup: function (challengeName, challengeParameters) {
      cognitoUser.associateSoftwareToken(this);
      console.log(challengeName);
      console.log(challengeParameters);
    },
  });
}
