import { Stack, Typography } from "@mui/material";
import TweetCard from "./TweetCard";
import { TweetDocument } from "@/firebase/types";
import { Filter } from "@/types";
import { useTweetFilter } from "@/contexts/TweetFilter";

function filterTweets(tweets: TweetDocument[], filter: Filter) {
  switch (filter) {
    case "Latest":
      return tweets
        .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds)
        .reverse();
    case "Media":
      return tweets.filter((tweet) => !!tweet.tweet.imageUrl);
    case "Top":
      return tweets
        .sort(
          (prevTweet, tweet) =>
            (prevTweet.likes?.length ?? 0) - (tweet.likes?.length ?? 0)
        )
        .reverse();
    default:
      return null;
  }
}

export default function Timeline({ tweets }: { tweets: TweetDocument[] }) {
  const { selectedFilter } = useTweetFilter();
  const filteredTweets = filterTweets(tweets, selectedFilter);
  return (
    <Stack gap={3}>
      {filteredTweets ? (
        filteredTweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))
      ) : (
        <Typography noWrap textAlign="center">
          No tweets
        </Typography>
      )}
    </Stack>
  );
}
