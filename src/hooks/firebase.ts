import {
  commentCollection,
  tweetCollection,
  userCollection,
} from "@/firebase/database";
import { auth } from "@/firebase/firebase";
import { TweetDocument } from "@/firebase/types";
import { DocumentReference, orderBy, query, where } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

export const useAuth = () => useAuthState(auth);

export const useUsers = () => useCollectionData(userCollection);
export const useTweets = () =>
  useCollectionData(query(tweetCollection, orderBy("createdAt", "desc")));
export const useComments = (tweetRef: DocumentReference<TweetDocument>) =>
  useCollectionData(
    query(commentCollection, where("tweetRef", "==", tweetRef))
  );
