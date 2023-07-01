import { handleLike } from "@/firebase/database";
import { TweetDocument } from "@/firebase/types";
import {
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DocumentReference } from "firebase/firestore";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useAuth, useComments, useUsers } from "@/hooks/firebase";
import { useRouter } from "next/router";
import LinkAvatar from "@/components/LinkAvatar";
import { grey } from "@mui/material/colors";
import { formatTimestamp } from "@/lib/utils";
import useUser from "@/hooks/useUser";

export default function Comments({
  tweetRef,
}: {
  tweetRef: DocumentReference<TweetDocument>;
}) {
  const [auth] = useAuth();
  const authUser = useUser(auth?.uid);
  const [comments] = useComments(tweetRef);
  const [users] = useUsers();
  const theme = useTheme();
  const router = useRouter();

  if (!comments || comments.length <= 0) {
    return null;
  }

  return (
    <>
      <Divider sx={{ mt: 0.5, mb: 1 }} />
      <Stack direction="row" gap={1.25}>
        <Stack gap={3}>
          {comments.map((comment) => {
            const like = !!comment.likes?.find(
              (like) => like.path === authUser?.ref.path
            );

            return (
              <Stack
                key={comment.id}
                direction="row"
                alignItems="start"
                gap={2}
              >
                <LinkAvatar
                  userId={comment.userRef.id}
                  photoUrl={
                    users?.find((user) => user.id === comment.userRef.id)
                      ?.photoUrl
                  }
                />
                <Box>
                  <Stack
                    sx={{
                      backgroundColor:
                        theme.palette.mode === "light" ? grey[50] : grey[900],
                      borderRadius: 2,
                      paddingTop: 1.25,
                      paddingX: 1.5,
                      paddingBottom: 2.75,
                    }}
                  >
                    <Stack direction="row" gap={1}>
                      <Typography fontSize={14} fontWeight={500} noWrap>
                        {
                          users?.find((user) => user?.id === comment.userRef.id)
                            ?.displayName
                        }
                      </Typography>
                      <Typography
                        fontSize={12}
                        fontWeight={500}
                        color="GrayText"
                        noWrap
                      >
                        {formatTimestamp(comment.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography>{comment.comment}</Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center">
                    <Button
                      variant="text"
                      color={like ? "error" : "inherit"}
                      onClick={async () => {
                        if (!authUser?.ref) {
                          router.push("/sign-in");
                          return;
                        }
                        await handleLike(authUser.ref, comment.ref);
                      }}
                      aria-label="add to favorites"
                    >
                      <FavoriteBorderOutlinedIcon sx={{ fontSize: 16 }} />{" "}
                      <Typography
                        fontSize={12}
                        fontWeight={600}
                        color={like ? "error" : "inherit"}
                        sx={{ textTransform: "none" }}
                      >
                        {like ? "Liked" : "Like"}
                      </Typography>
                    </Button>
                    <Box component="span" marginRight={1}>
                      ·
                    </Box>
                    <Typography
                      fontSize={12}
                      fontWeight={600}
                      color="GrayText"
                      sx={{ textTransform: "none" }}
                    >
                      {comment.likes?.length ?? 0} Likes
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </>
  );
}
