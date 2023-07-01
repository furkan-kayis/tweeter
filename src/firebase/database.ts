import {
  DocumentReference,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "./firebase";
import {
  CommentDocument,
  CommentModel,
  FirestoreDocument,
  TweetDocument,
  TweetModel,
  UserDocument,
  UserModel,
} from "./types";

const converter = <T extends FirestoreDocument<T>>() => ({
  toFirestore: (data: T) => {
    data.createdAt = Timestamp.now();

    return data;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<T>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    data.id = snapshot.id;
    data.ref = snapshot.ref;

    return data;
  },
});

const getCollection = <T extends FirestoreDocument<T>>(
  path: "users" | "tweets" | "comments"
) => collection(firestore, path).withConverter<T>(converter<T>());

export const userCollection = getCollection<UserDocument>("users");
export const tweetCollection = getCollection<TweetDocument>("tweets");
export const commentCollection = getCollection<CommentDocument>("comments");

export async function getUser(userId: string) {
  const ref = doc(userCollection, userId);
  const userDoc = await getDoc(ref);
  return userDoc.data();
}

export async function getUsers(refs: DocumentReference<UserDocument>[]) {
  const query = await getDocs(userCollection);

  const users = query.docs.map((doc) => doc.data());

  const refsWithoutDuplicates = refs.filter(
    (value, index, array) => index === array.findIndex((r) => r.id === value.id)
  );

  return users.filter((user) =>
    refsWithoutDuplicates.find((ref) => user.id === ref.id)
  );
}
export async function getTweets() {
  const query = await getDocs(tweetCollection);

  return query.docs.map((doc) => doc.data());
}

export async function checkUserExists(userId: string) {
  const userDoc = await getDoc(doc(userCollection, userId));

  return userDoc.exists();
}

export function addUser(user: UserModel, authId: string) {
  setDoc(doc(userCollection, authId), user);
}

const arrayToggle = (condition: boolean, ref: DocumentReference) =>
  condition ? arrayRemove(ref) : arrayUnion(ref);

export async function postTweet(tweet: TweetModel) {
  const tweetRef = await addDoc(tweetCollection, tweet);
  updateDoc(tweet.userRef, { tweets: arrayUnion(tweetRef) });
}

export async function addTweetTo(
  path: "bookmarks" | "retweets",
  tweetRef: DocumentReference<TweetDocument>,
  userRef: DocumentReference<UserDocument>
) {
  const userDoc = await getDoc(userRef);
  const user = userDoc.data();
  const userAdds = user?.[path];

  const added = Boolean(userAdds?.find((add) => add.id === tweetRef.id));

  updateDoc(userRef, {
    [path]: arrayToggle(added, tweetRef),
  });
}

export async function handleFollow(
  userRef: DocumentReference<UserDocument>,
  followedUserRef: DocumentReference<UserDocument>
) {
  const followedUserDoc = await getDoc(followedUserRef);
  const followedUser = followedUserDoc.data();

  const followed = Boolean(
    followedUser?.followers?.find((follower) => follower.id === userRef.id)
  );

  updateDoc(userRef, {
    following: arrayToggle(followed, followedUserRef),
  });
  updateDoc(followedUserRef, {
    followers: arrayToggle(followed, userRef),
  });
}

export async function handleLike(
  userRef: DocumentReference<UserDocument>,
  likeRef: DocumentReference<TweetDocument | CommentDocument>
) {
  const userDoc = await getDoc(userRef);
  const user = userDoc.data();

  const liked = Boolean(user?.likes?.find((like) => like.id === likeRef.id));

  updateDoc(userRef, {
    likes: arrayToggle(liked, likeRef),
  });
  updateDoc(likeRef, {
    likes: arrayToggle(liked, userRef),
  });

  return liked;
}

export async function handleRetweet(
  userRef: DocumentReference<UserDocument>,
  bookmarkRef: DocumentReference<TweetDocument | CommentDocument>
) {
  const userDoc = await getDoc(userRef);
  const user = userDoc.data();

  const retweeted = Boolean(
    user?.retweets?.find((retweet) => retweet.id === bookmarkRef.id)
  );

  updateDoc(userRef, {
    retweets: arrayToggle(retweeted, bookmarkRef),
  });
  updateDoc(bookmarkRef, {
    retweets: arrayToggle(retweeted, userRef),
  });

  return retweeted;
}

export async function handleBookmark(
  userRef: DocumentReference<UserDocument>,
  bookmarkRef: DocumentReference<TweetDocument | CommentDocument>
) {
  const userDoc = await getDoc(userRef);
  const user = userDoc.data();

  const bookmarked = Boolean(
    user?.bookmarks?.find((retweet) => retweet.id === bookmarkRef.id)
  );

  updateDoc(userRef, {
    bookmarks: arrayToggle(bookmarked, bookmarkRef),
  });
  updateDoc(bookmarkRef, {
    bookmarks: arrayToggle(bookmarked, userRef),
  });

  return bookmarked;
}

export async function handleComment(comment: CommentModel) {
  const commentRef = await addDoc(commentCollection, comment);

  updateDoc(comment.userRef, {
    comments: arrayUnion(commentRef),
  });
  updateDoc(comment.tweetRef, {
    comments: arrayUnion(commentRef),
  });
}

export async function getComments(tweetRef: DocumentReference<TweetDocument>) {
  const commentQuery = query(
    commentCollection,
    where("tweetRef", "==", tweetRef)
  );
  const snapshot = await getDocs(commentQuery);

  return snapshot.docs.map((doc) => doc.data());
}

export function updateBio(
  userRef: DocumentReference<UserDocument>,
  bio: string
) {
  updateDoc(userRef, {
    bio,
  });
}

export async function updatePhotoUrl(
  userRef: DocumentReference<UserDocument>,
  photoUrl: string
) {
  updateDoc(userRef, {
    photoUrl,
  });
}

export async function updateCoverUrl(
  userRef: DocumentReference<UserDocument>,
  coverUrl: string
) {
  updateDoc(userRef, {
    coverUrl,
  });
}
