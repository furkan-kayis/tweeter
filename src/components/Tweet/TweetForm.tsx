import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {
  Button,
  CardMedia,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextareaAutosize,
} from "@mui/material";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { useState } from "react";
import { postTweet } from "@/firebase/database";
import LinkAvatar from "../LinkAvatar";
import { getImageUrl, uploadImage } from "@/firebase/storage";
import useUser from "@/hooks/useUser";
import { useAuth } from "@/hooks/firebase";

const replyChoices = ["Everyone", "People you follow"] as const;

type Reply = (typeof replyChoices)[number];

function ReplyIcon({ reply }: { reply: Reply }) {
  const style = { mr: 0.5, fontSize: 20 };
  switch (reply) {
    case "Everyone":
      return <PublicRoundedIcon sx={style} />;
    case "People you follow":
      return <PeopleAltRoundedIcon sx={style} />;
    default:
      return null;
  }
}

export default function TweetForm() {
  const [auth] = useAuth();
  const authUser = useUser(auth?.uid);
  const [selected, setSelected] = useState<Reply>("Everyone");
  const [tweet, setTweet] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File>();

  if (!authUser) {
    return null;
  }

  return (
    <Card sx={{ px: 2.5, py: 1.25, borderRadius: 3 }}>
      <Typography fontSize={12} fontWeight={600} lineHeight={1}>
        Tweet something
      </Typography>
      <Divider sx={{ marginBlock: 1 }} />
      {url && (
        <CardMedia
          component="img"
          sx={{ objectFit: "contain", mb: 1, borderRadius: 2 }}
          image={url}
          alt="Post image"
        />
      )}
      <Stack
        display="grid"
        gridTemplateColumns="auto 1fr"
        gridTemplateRows="1fr auto"
        gap={1}
      >
        <LinkAvatar userId={authUser.id} photoUrl={authUser.photoUrl} />
        <Stack direction="row" gap={1} alignItems="center">
          <TextareaAutosize
            placeholder="What’s happening?"
            value={tweet}
            onChange={(e) => {
              if (tweet.length < 180) {
                setTweet(e.target.value);
              }
            }}
            style={{
              color: "inherit",
              backgroundColor: "transparent",
              resize: "none",
              fontSize: 16,
              fontWeight: 500,
              border: "none",
              outline: "transparent",
              flexGrow: 1,
            }}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          sx={{ gridColumnStart: { xs: 1, sm: 2 }, gridColumnEnd: -1 }}
        >
          <IconButton component="label">
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => {
                const file = event.target.files?.item(0);
                if (file) {
                  setFile(file);
                  const reader = new FileReader();
                  reader.addEventListener("load", () => {
                    setUrl(reader.result as string);
                  });
                  reader.readAsDataURL(file);
                }
              }}
            />
            <ImageOutlinedIcon
              sx={{
                fontSize: 20,
                color: "primary.main",
                cursor: "pointer",
              }}
            />
          </IconButton>

          <PopupState variant="popover">
            {(popupState) => (
              <>
                <Button
                  variant="text"
                  sx={{ textTransform: "none" }}
                  {...bindTrigger(popupState)}
                >
                  <ReplyIcon reply={selected} />
                  <Typography fontSize={12} fontWeight={500} lineHeight={1}>
                    {selected} can reply
                  </Typography>
                </Button>
                <Menu {...bindMenu(popupState)}>
                  {replyChoices.map((reply) => (
                    <MenuItem
                      key={reply}
                      onClick={() => {
                        setSelected(reply);
                        popupState.close();
                      }}
                    >
                      <ReplyIcon reply={reply} />{" "}
                      <Typography fontSize={12} fontWeight={500}>
                        {reply}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </PopupState>
          <Button
            variant="contained"
            disabled={!tweet}
            onClick={async () => {
              let imageUrl;

              if (file) {
                const result = await uploadImage(file);
                imageUrl = await getImageUrl(result.ref.fullPath);
              }

              postTweet({
                canReply: selected === "Everyone" ? "everyone" : "following",
                ...(imageUrl
                  ? { tweet: { text: tweet, imageUrl } }
                  : { tweet: { text: tweet } }),
                userRef: authUser.ref,
              });

              setUrl("");
              setTweet("");
              setFile(undefined);
              setSelected("Everyone");
            }}
            sx={{
              marginLeft: "auto",
              textTransform: "capitalize",
              fontSize: 12,
            }}
          >
            Tweet
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
