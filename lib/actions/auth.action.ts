'use server';

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { _success } from "zod/v4/core";
import { ca } from "zod/v4/locales";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds

export async function signUp(params:SignUpParams){
    const{ uid, name, email } = params;
    try {
        //getting user record
        const userRecord = await db.collection('users').doc(uid).get();
        
        //checking if user already exists
        if(userRecord.exists) {
            return { 
                success: false, 
                message: 'User already exists' 
            };
        }
        //creating new user
        await db.collection('users').doc(uid).set({
            name,email
        })

        return {
            success: true,
            message: 'User created successfully, Please Sign In.'
        }
    }
    catch (error :any) {
        console.error("Error during sign up:", error);

        if(error.code === 'auth/email-already-exists') {
            return { 
                success: false, 
                message: 'Email already in use' 
            };
        }

        return{
            success: false, 
            message: 'An error occurred during sign up. Please try again later.' 
        }
    }  
}


export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return {
                success: false,
                message: 'User not found. Please sign up first.'
            };
        }

        //if the user exists, create a session cookie
        //this will be used to authenticate the user in the next requests
        await setSessionCookie(idToken);
        
    } catch (error: any) {
        console.error("Error during sign in:", error);
        return {
            success: false,
            message: 'An error occurred during sign in. Please try again later.'
        };
        
    }
}


export async function setSessionCookie(idtoken: string) {
    // Validate the ID token
  const cookieStore = await cookies();
  const sessionCookie = await auth.createSessionCookie(idtoken, {
    expiresIn: ONE_WEEK // 7 days
  })
  //cookie configuration
  cookieStore.set('session', sessionCookie, {
    maxAge: ONE_WEEK, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/',
    sameSite: 'lax', // Adjust as needed
  })
}


//to protect routes and autthorize to the authenticated user
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null; // No session cookie found
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
    if (!userRecord.exists) {
      return null; // User not found
    }
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User; // Return user data

  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null; // Invalid session cookie
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user; // Return true if user is authenticated, false otherwise
}

export async function getInterviewsByUserId(userId: string) : Promise<Interview[] | null> {

  const interviews = await db
  .collection('interviews')
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc')
  .get();

return interviews.docs.map((doc) => ({
  id: doc.id,
  ...doc.data()
})) as Interview[];

}

//interviews created by other users
export async function getLatestInterviews(params: GetLatestInterviewsParams) : Promise<Interview[] | null> {

  const { userId, limit = 20 } = params;
  const interviews = await db
  .collection('interviews')
  .orderBy('createdAt', 'desc')
  .where('finalized', '==', true)
  .where('userId', '!=', userId)
  .limit(limit)
  .get();

return interviews.docs.map((doc) => ({
  id: doc.id,
  ...doc.data()
})) as Interview[];

}



