import { TweetDocument } from "@/firebase/types";
import { useEffect, useState } from "react";
import { useAuth } from "./firebase";

export type Actions = {
  like: boolean;
  retweet: boolean;
  bookmark: boolean;
};

export default function useActions(tweet: TweetDocument) {
  const [auth] = useAuth();
  const [actions, setActions] = useState<Actions>({
    like: false,
    retweet: false,
    bookmark: false,
  });

  useEffect(() => {
    const actions = ["like", "retweet", "bookmark"] as const;

    actions.map((action) =>
      setActions((actions) => ({
        ...actions,
        [action]: tweet[`${action}s`]?.find((ref) => ref.id === auth?.uid)
          ? true
          : false,
      }))
    );
  }, [auth?.uid, tweet]);

  return { actions, setActions };
}
