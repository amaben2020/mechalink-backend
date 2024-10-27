import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@firebase/auth';
import { firebaseAdmin, auth } from 'config/firebase.js';
import { MechalinkRequired } from 'errors/400/required-error.js';
import express from 'express';

type TUserCredentials = {
  email: string;
  password: string;
};

class FirebaseAuthController {
  async register({ email, password }: TUserCredentials) {
    console.log(email, password);
    if (!email && !password) {
      throw new MechalinkRequired('Email and password must be provided');
    }

    try {
      const user = await firebaseAdmin.auth().createUser({
        email,
        password,
      });

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async login({ email, password }: TUserCredentials) {
    if (!email || !password) {
      throw new MechalinkRequired('Email and password must be provided');
    }
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredentials;
    } catch (error) {
      console.log(error);
    }
  }

  async logoutUser(res: express.Response) {
    try {
      signOut(auth).then(() => {
        res.clearCookie('access_token');
        res.status(200).json({ message: 'User logged out successfully' });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async resetPassword({ email }: { email: string }) {
    if (!email) {
      throw new MechalinkRequired('Email must be provided');
    }
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error(error);
    }
  }
}

const firebaseAuthController = new FirebaseAuthController();

export default firebaseAuthController;
