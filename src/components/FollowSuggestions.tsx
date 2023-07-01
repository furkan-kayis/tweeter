import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
const people = [
  {
    id: 1,
    displayName: "Mikael Stanley",
    followers: "230k",
    bio: "Photographer & Filmmaker based in Copenhagen, Denmark ✵ 🇩🇰",
  },
  {
    id: 2,
    displayName: "Austin Neill",
    followers: "120k",
    bio: "Follow me on IG: @arstyy",
  },
];

export default function Trends() {
  return (
    <Card
      sx={{
        borderRadius: 3,
        paddingX: 2.5,
        paddingTop: 1.25,
      }}
    >
      <Typography fontSize={12} fontWeight={600} mb={1}>
        Who to follow
      </Typography>
      <Divider />
      <List>
        {people.map((person) => (
          <ListItem
            key={person.id}
            disableGutters
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: 1,
            }}
          >
            <Avatar variant="rounded" sx={{ borderRadius: 2 }} />
            <Box>
              <Typography component="div" fontWeight={500} lineHeight={1.5}>
                {person.displayName}
              </Typography>
              <Typography
                component="div"
                color={"GrayText"}
                fontSize={12}
                fontWeight={500}
              >
                {person.followers} followers
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                fontSize: 12,
                textTransform: "none",
              }}
            >
              <PersonAddRoundedIcon sx={{ fontSize: 14, mr: 0.5 }} /> Follow
            </Button>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
