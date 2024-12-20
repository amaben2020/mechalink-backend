export const fbaseConfig = {
  type: 'service_account',
  project_id: 'mechalink-auth',
  private_key_id: 'bf09c4b66a7c10e85cd36446a55ef1235e616592',
  private_key: process.env.FIREBASE_CERT,
  client_email:
    'firebase-adminsdk-teohd@mechalink-auth.iam.gserviceaccount.com',
  client_id: '112121496256562127081',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-teohd%40mechalink-auth.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
