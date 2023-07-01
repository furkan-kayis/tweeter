import { DocumentReference, Timestamp } from "firebase/firestore";

export interface FirestoreDocument<T extends FirestoreDocument<T>> {
  id: string;
  ref: DocumentReference<T>;
  createdAt: Timestamp;
}

export interface UserDocument extends FirestoreDocument<UserDocument> {
  displayName: string;
  bio?: string;
  photoUrl?: string;
  coverUrl?: string;
  followers?: DocumentReference<UserDocument>[];
  following?: DocumentReference<UserDocument>[];
  tweets?: DocumentReference<TweetDocument>[];
  likes?: DocumentReference<TweetDocument | CommentDocument>[];
  bookmarks?: DocumentReference<TweetDocument>[];
  retweets?: DocumentReference<TweetDocument>[];
  comments?: DocumentReference<CommentDocument>[];
}

export interface TweetDocument extends FirestoreDocument<TweetDocument> {
  tweet: {
    text: string;
    imageUrl?: string;
  };
  canReply: "everyone" | "following";
  userRef: DocumentReference<UserDocument>;
  likes?: DocumentReference<UserDocument>[];
  comments?: DocumentReference<CommentDocument>[];
  bookmarks?: DocumentReference<UserDocument>[];
  retweets?: DocumentReference<UserDocument>[];
}

export interface CommentDocument extends FirestoreDocument<CommentDocument> {
  comment: string;
  userRef: DocumentReference<UserDocument>;
  tweetRef: DocumentReference<TweetDocument>;
  likes?: DocumentReference<UserDocument>[];
}

type BaseModel<T extends FirestoreDocument<T>> = Omit<
  T,
  keyof FirestoreDocument<T>
>;

export type UserModel = BaseModel<UserDocument>;
export type TweetModel = BaseModel<TweetDocument>;
export type CommentModel = BaseModel<CommentDocument>;
