import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import TweetForm from "@/components/Tweet/TweetForm";
import Timeline from "@/components/Tweet/Timeline";
import Trends from "@/components/Trends";
import FollowSuggestions from "@/components/FollowSuggestions";
import { useTweets } from "@/hooks/firebase";

export default function Home() {
  const matches = useMediaQuery("(min-width:50em)");
  const [tweets] = useTweets();

  return (
    <>
      <Head>
        <title>Home - Tweeter</title>
      </Head>
      <Box
        display="grid"
        component={Container}
        gap={3}
        gridTemplateColumns={{ lg: "745px 306px" }}
        justifyContent="center"
      >
        <Stack gap={3}>
          <TweetForm />
          {tweets ? (
            <Timeline tweets={tweets} />
          ) : (
            <Typography noWrap textAlign="center">
              No tweets
            </Typography>
          )}
        </Stack>
        {matches && (
          <Box position="relative" height={100}>
            <Stack position="fixed" gap={3}>
              <Trends />
              <FollowSuggestions />
            </Stack>
          </Box>
        )}
      </Box>
    </>
  );
}
