import Timeline from "@/components/Tweet/Timeline";
import TweetFilter from "@/components/TweetFilter";
import { useAuth, useTweets } from "@/hooks/firebase";
import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";

export default function Bookmarks() {
  const [tweets, loading] = useTweets();
  const [auth] = useAuth();

  const bookmarks = tweets?.filter((tweet) =>
    tweet.bookmarks?.find((bookmark) => bookmark.id === auth?.uid)
  );

  if (!tweets) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Bookmarks - Tweeter</title>
      </Head>
      <Box
        component={Container}
        mt={1}
        display="grid"
        gap={3}
        gridTemplateColumns={{ lg: "306px 745px" }}
        justifyContent="center"
      >
        {bookmarks && bookmarks.length > 0 ? (
          <>
            <TweetFilter />
            <Timeline tweets={bookmarks} />
          </>
        ) : (
          !loading && <Typography textAlign="center">No bookmarks</Typography>
        )}
      </Box>
    </>
  );
}
