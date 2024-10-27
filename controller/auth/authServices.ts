import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const REGION = 'us-east-1';
// const USER_POOL_CLIENT_ID = '17l9e7dms24sgnlu022n19c5jn';
const USER_POOL_CLIENT_ID = '71cvhodsrsau3ssvuaehvuhotm';

// Initialize the CognitoIdentityProviderClient
const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

/**
 * Authenticate a user with Cognito
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @returns {Promise<Object>} - The authentication result, which includes tokens if successful
 */

export async function signUpUser(
  username: string,
  password: string,
  email: string
) {
  const params = {
    ClientId: USER_POOL_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  };

  try {
    const command = new SignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log('Sign-up successful:', response);
    return response;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signInUser(username: string, password: string) {
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: USER_POOL_CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  try {
    const command = new InitiateAuthCommand(params);
    const response = await cognitoClient.send(command);

    // The tokens are located in response.AuthenticationResult
    return response.AuthenticationResult;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function confirmSignUp(
  username: string,
  confirmationCode: string
) {
  console.log('Confirm code,', confirmationCode);
  const params = {
    ClientId: USER_POOL_CLIENT_ID,
    Username: username,
    ConfirmationCode: confirmationCode,
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    const response = await cognitoClient.send(command);
    console.log('User confirmed successfully:', response);
    return response;
  } catch (error) {
    console.error('Error confirming sign-up:', error);
    throw error;
  }
}

export async function resendConfirmationCode(username: string) {
  const params = {
    ClientId: USER_POOL_CLIENT_ID,
    Username: username,
  };

  try {
    const command = new ResendConfirmationCodeCommand(params);
    const response = await cognitoClient.send(command);
    console.log('Confirmation code resent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error resending confirmation code:', error);
    throw error;
  }
}
