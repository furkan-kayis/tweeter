import Timeline from "@/components/Tweet/Timeline";
import { useTweets, useUsers } from "@/hooks/firebase";
import { Box, Container, Stack, TextField } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import TweetFilter from "@/components/TweetFilter";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [tweets] = useTweets();
  const [users] = useUsers();

  if (!tweets) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Explore - Tweeter</title>
      </Head>
      <Box
        component={Container}
        display="grid"
        gap={3}
        gridTemplateColumns={{ lg: "306px 745px" }}
        justifyContent="center"
      >
        <TweetFilter />
        <Stack gap={3}>
          <Stack
            direction="row"
            px={1.5}
            alignItems="center"
            justifyContent="space-between"
            borderRadius={2}
            bgcolor="background.paper"
          >
            <SearchRoundedIcon />
            <TextField
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              sx={{
                "& fieldset": { border: "none" },
                flexGrow: 1,
                fontWeight: 500,
                lineHeight: 1.5,
              }}
            />
          </Stack>
          <Timeline
            tweets={tweets.filter((tweet) =>
              users?.find(
                (user) =>
                  user.displayName.toLocaleLowerCase().includes(search) &&
                  user.id === tweet.userRef.id
              )
            )}
          />
        </Stack>
      </Box>
    </>
  );
}
