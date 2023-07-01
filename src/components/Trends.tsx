import { Card, Divider, List, ListItem, Typography } from "@mui/material";

const trends = [
  { title: "#programming", tweets: "213k" },
  { title: "#devchallenges", tweets: "123k" },
  { title: "#frontend", tweets: "34k" },
  { title: "#helsinki", tweets: "11k" },
  { title: "#100DaysOfCode", tweets: "5k" },
  { title: "#learntocode", tweets: "1k" },
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
        Trends for you
      </Typography>
      <Divider />
      <List sx={{ py: 2 }}>
        {trends.map((trend) => (
          <ListItem key={trend.title} sx={{ display: "block" }} disableGutters>
            <Typography
              component="div"
              fontWeight={600}
              lineHeight={1.375}
              letterSpacing="-0.035em"
            >
              {trend.title}
            </Typography>
            <Typography
              component="div"
              color="gray"
              fontSize={12}
              fontWeight={500}
              lineHeight={1}
              mt={1}
            >
              {trend.tweets} Tweets
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  );
}
