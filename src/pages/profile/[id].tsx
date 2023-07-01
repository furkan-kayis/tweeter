import Head from "next/head";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuth, useTweets } from "@/hooks/firebase";
import Timeline from "@/components/Tweet/Timeline";
import { handleFollow, updateBio } from "@/firebase/database";
import { useState } from "react";
import TweetFilter from "@/components/TweetFilter";
import { handleImageUpload } from "@/lib/utils";

export default function Profile() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const profile = useUser(router.query.id as string);
  const [auth] = useAuth();
  const authUser = useUser(auth?.uid);
  const [tweets] = useTweets();
  const [bio, setBio] = useState("");

  if (!profile) {
    return null;
  }

  const userTweets = tweets?.filter(
    (tweet) =>
      tweet.userRef.id === profile?.id ||
      tweet.retweets?.find((retweet) => retweet.id === profile?.id)
  );

  const isAuthProfile = authUser?.id === profile.id;

  const following = !!authUser?.following?.find(
    (follow) => follow.id === profile.id
  );

  return (
    <>
      <Head>
        <title>{profile.displayName} - Tweeter</title>
      </Head>
      <Stack gap={6} mt={-3} position="relative">
        <Box position="relative" height={375}>
          {profile.coverUrl && (
            <Image
              src={profile.coverUrl}
              alt="User cover"
              priority
              fill
              style={{ objectFit: "cover" }}
            />
          )}
        </Box>
        <Container>
          <Box height={300}>
            <Box
              maxWidth={1075}
              mx="auto"
              sx={{
                position: "absolute",
                top: 350,
                left: 0,
                right: 0,
              }}
            >
              <Card
                sx={{
                  p: 6,
                  borderRadius: 4,
                  display: "grid",
                  justifyItems: "center",
                  mb: 6,
                }}
              >
                <Avatar
                  component="label"
                  variant="rounded"
                  src={profile.photoUrl}
                  sx={{
                    height: 116,
                    width: 116,
                    position: "absolute",
                    top: -90,
                    borderRadius: 3,
                    border: 4,
                    borderColor: "background.paper",
                  }}
                />

                <Typography fontSize={24} fontWeight={600}>
                  {profile.displayName}
                </Typography>
                <Stack direction="row" gap={4}>
                  <Typography variant="caption" fontWeight={500}>
                    <Typography variant="caption" fontWeight={600}>
                      {profile.following?.length ?? 0}
                    </Typography>{" "}
                    Following
                  </Typography>{" "}
                  <Typography variant="caption" fontWeight={500}>
                    <Typography variant="caption" fontWeight={600}>
                      {profile.followers?.length ?? 0}
                    </Typography>{" "}
                    Followers
                  </Typography>
                </Stack>
                <Typography
                  fontSize={18}
                  fontWeight={500}
                  mt={4}
                  maxWidth="40ch"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setBio(profile.bio ?? "");
                    setOpen(true);
                  }}
                >
                  {profile.bio}
                </Typography>
                <Modal
                  open={open}
                  onClose={() => setOpen(false)}
                  aria-labelledby="Update bio"
                >
                  <Box
                    component="form"
                    sx={{
                      position: "absolute" as "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 400,
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      p: 4,
                      display: "grid",
                      gap: 2,
                    }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      updateBio(profile.ref, bio);
                      setOpen(false);
                    }}
                  >
                    <TextField
                      type="text"
                      value={bio}
                      onChange={(e) => {
                        if (bio.length < 180) {
                          setBio(e.target.value);
                        }
                      }}
                    />
                    <Button type="submit">Change bio</Button>
                  </Box>
                </Modal>
                {isAuthProfile && (
                  <Stack direction={{ sm: "row" }} gap={1} mt={2}>
                    <Button component="label">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.target.files?.item(0);
                          if (file) {
                            handleImageUpload(file, authUser, "avatar");
                          }
                        }}
                      />
                      change avatar
                    </Button>
                    <Button component="label">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => {
                          const file = event.target.files?.item(0);
                          if (file) {
                            handleImageUpload(file, authUser, "cover");
                          }
                        }}
                      />
                      change cover
                    </Button>
                  </Stack>
                )}

                {!isAuthProfile && authUser && (
                  <Button
                    variant="contained"
                    sx={{ textTransform: "capitalize", mt: 6 }}
                    onClick={() => handleFollow(authUser.ref, profile.ref)}
                  >
                    {following ? "Unfollow" : "Follow"}
                  </Button>
                )}
              </Card>
            </Box>
          </Box>
          {userTweets && userTweets.length > 0 ? (
            <Box
              display="grid"
              gap={3}
              gridTemplateColumns={{ lg: "306px 745px" }}
              justifyContent="center"
            >
              <TweetFilter />
              <Timeline tweets={userTweets} />
            </Box>
          ) : (
            <Typography textAlign="center">No tweets found</Typography>
          )}
        </Container>
      </Stack>
    </>
  );
}
