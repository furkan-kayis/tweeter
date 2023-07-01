import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  CardMedia,
  Divider,
  Stack,
  useMediaQuery,
} from "@mui/material";
import CachedOutlinedIcon from "@mui/icons-material/CachedOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { TweetDocument } from "@/firebase/types";
import useUser from "@/hooks/useUser";
import { handleBookmark, handleLike, handleRetweet } from "@/firebase/database";
import useActions from "@/hooks/useActions";
import CommentForm from "./CommentForm";
import Comments from "./Comments";
import { useRouter } from "next/router";
import LinkAvatar from "@/components/LinkAvatar";
import { formatTimestamp } from "@/lib/utils";
import { useAuth } from "@/hooks/firebase";

export default function TweetCard({ tweet }: { tweet: TweetDocument }) {
  const matches = useMediaQuery("(min-width:30em)");
  const { actions, setActions } = useActions(tweet);
  const router = useRouter();

  const [auth] = useAuth();
  const authUser = useUser(auth?.uid);
  const author = useUser(tweet.userRef.id);

  if (!author) {
    return null;
  }

  return (
    <Card sx={{ borderRadius: 2, p: 2.5 }}>
      <Stack direction="row" gap={2.25}>
        <LinkAvatar userId={author?.id} photoUrl={author.photoUrl} />
        <Box>
          <Stack>
            <Typography fontWeight={500} lineHeight={1.5}>
              {author.displayName}
            </Typography>
            <Typography
              fontWeight={500}
              fontSize={12}
              lineHeight={1}
              color="GrayText"
            >
              {formatTimestamp(tweet.createdAt)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Typography mt={1.75} mb={2.25} lineHeight={1.375}>
        {tweet.tweet.text}
      </Typography>
      {tweet.tweet.imageUrl && (
        <CardMedia
          component="img"
          image={tweet.tweet.imageUrl}
          alt="Tweet Image"
          sx={{ borderRadius: 2 }}
        />
      )}
      <Stack direction="row" justifyContent="end" gap={2} mt={1.5} mb={1}>
        <Typography
          fontWeight={500}
          fontSize={12}
          lineHeight={1}
          color="GrayText"
        >
          {tweet.comments?.length ?? 0} Comments
        </Typography>
        <Typography
          fontWeight={500}
          fontSize={12}
          lineHeight={1}
          color="GrayText"
        >
          {tweet.retweets?.length ?? 0} Retweets
        </Typography>
        <Typography
          fontWeight={500}
          fontSize={12}
          lineHeight={1}
          color="GrayText"
        >
          {tweet.likes?.length ?? 0} Likes
        </Typography>
      </Stack>
      <Divider sx={{ mt: 0.5, mb: 1 }} />
      <Stack direction="row" justifyContent="space-between">
        <Button
          variant="text"
          sx={{ flex: 1, textTransform: "none", borderRadius: 2 }}
          color={actions.retweet ? "success" : "inherit"}
          onClick={async () => {
            if (!authUser) {
              router.push("/sign-in");
              return;
            }
            const retweet = await handleRetweet(authUser?.ref, tweet.ref);
            setActions((actions) => ({ ...actions, retweet }));
          }}
          aria-label="share"
        >
          <CachedOutlinedIcon style={{ fontSize: 20 }} />{" "}
          {matches && (actions.retweet ? "Retweeted" : "Retweet")}
        </Button>
        <Button
          variant="text"
          sx={{ flex: 1, textTransform: "none", borderRadius: 2 }}
          color={actions.like ? "error" : "inherit"}
          onClick={async () => {
            if (!authUser) {
              router.push("/sign-in");
              return;
            }
            const like = await handleLike(authUser?.ref, tweet.ref);
            setActions((actions) => ({ ...actions, like }));
          }}
          aria-label="add to favorites"
        >
          <FavoriteBorderOutlinedIcon style={{ fontSize: 20 }} />{" "}
          {matches && (actions.like ? "Liked" : "Like")}
        </Button>
        <Button
          variant="text"
          sx={{ flex: 1, textTransform: "none", borderRadius: 2 }}
          color={actions.bookmark ? "primary" : "inherit"}
          onClick={async () => {
            if (!authUser) {
              router.push("/sign-in");
              return;
            }
            const bookmark = await handleBookmark(authUser?.ref, tweet.ref);
            setActions((actions) => ({ ...actions, bookmark }));
          }}
          aria-label="bookmark"
        >
          <BookmarkBorderOutlinedIcon style={{ fontSize: 20 }} />{" "}
          {matches && (actions.bookmark ? "Saved" : "Save")}
        </Button>
      </Stack>
      {authUser && (
        <>
          <Divider sx={{ mt: 0.5, mb: 1 }} />
          <CommentForm tweetRef={tweet.ref} userRef={authUser.ref} />
        </>
      )}
      <Comments tweetRef={tweet.ref} />
    </Card>
  );
}
