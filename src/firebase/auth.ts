import { auth } from "@/firebase/firebase";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { addUser, checkUserExists } from "./database";

export async function signUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  addUser(
    {
      displayName: `${firstName} ${lastName}`,
    },
    user.uid
  );
}

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, new GoogleAuthProvider());

  const registered = await checkUserExists(user.uid);

  if (!registered) {
    if (!user.displayName) {
      throw new Error("Error while signing in");
    }

    addUser(
      {
        displayName: user.displayName,
      },
      user.uid
    );
  }
}

export function signOutUser() {
  return signOut(auth);
}
