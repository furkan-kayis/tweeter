import { handleComment } from "@/firebase/database";
import { TweetDocument, UserDocument } from "@/firebase/types";
import { IconButton, Stack, TextareaAutosize, useTheme } from "@mui/material";
import { DocumentReference } from "firebase/firestore";
import { useState } from "react";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import LinkAvatar from "@/components/LinkAvatar";
import useUser from "@/hooks/useUser";

export default function CommentForm({
  tweetRef,
  userRef,
}: {
  tweetRef: DocumentReference<TweetDocument>;
  userRef: DocumentReference<UserDocument>;
}) {
  const [comment, setComment] = useState("");
  const theme = useTheme();
  const user = useUser(userRef.id);
  return (
    <Stack direction="row" gap={2}>
      <LinkAvatar userId={userRef.id} photoUrl={user?.photoUrl} />
      <Stack
        direction="row"
        bgcolor={theme.palette.mode === "light" ? "#f2f2f2" : "#272727"}
        flex={1}
        sx={{
          borderRadius: 2,
          px: 1.5,
        }}
      >
        <TextareaAutosize
          placeholder="Tweet your reply"
          value={comment}
          onChange={(e) => {
            if (comment.length < 180) {
              setComment(e.target.value);
            }
          }}
          style={{
            resize: "none",
            color: "inherit",
            backgroundColor: "transparent",
            border: "none",
            outline: "transparent",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: 1.4,
            alignSelf: "center",
            flexGrow: 1,
          }}
        />
        <IconButton
          aria-label="Add comment"
          color="primary"
          disabled={!comment}
          onClick={() => {
            handleComment({ comment, userRef, tweetRef });
            setComment("");
          }}
        >
          <SendRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Stack>
    </Stack>
  );
}
