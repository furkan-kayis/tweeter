import { TweetDocument } from "@/firebase/types";
import { Filter } from "@/types";
import { createContext, useContext, useState } from "react";

type Context = {
  selectedFilter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

const TweetFilterContext = createContext<Context>({
  selectedFilter: "Top",
  setFilter: () => {},
});

export function useTweetFilter() {
  return useContext(TweetFilterContext);
}

export default function TweetFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFilter, setFilter] = useState<Filter>("Top");

  return (
    <TweetFilterContext.Provider value={{ selectedFilter, setFilter }}>
      {children}
    </TweetFilterContext.Provider>
  );
}

export function filterTweets(tweets: TweetDocument[], filter: Filter) {
  switch (filter) {
    case "Latest":
      return tweets;
    case "Media":
      return tweets.filter((tweet) => !!tweet.tweet.imageUrl);
    case "Top":
      return tweets.sort(
        (prevTweet, tweet) =>
          (prevTweet.likes?.length ?? 0) - (tweet.likes?.length ?? 0)
      );
    default:
      return null;
  }
}
