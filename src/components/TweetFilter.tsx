import { FILTERS } from "@/constants";
import { useTweetFilter } from "@/contexts/TweetFilter";
import { Box, Card, Tab, Tabs } from "@mui/material";

export default function TweetFilter() {
  const { selectedFilter, setFilter } = useTweetFilter();

  return (
    <Card sx={{ height: 220, borderRadius: 2 }}>
      <Box display="flex" pt={2.5}>
        <Tabs
          orientation="vertical"
          value={FILTERS.indexOf(selectedFilter)}
          aria-label="Filter Tweets"
          TabIndicatorProps={{
            style: {
              left: 0,
              width: 3,
              borderTopRightRadius: 4,
              borderBottomRightRadius: 4,
            },
          }}
        >
          {FILTERS.map((filter) => (
            <Tab
              label={filter}
              onClick={() => setFilter(filter)}
              key={filter}
              sx={{
                textTransform: "none",
                minHeight: "auto",
                alignItems: "baseline",
                fontWeight: 600,
                p: 0,
                px: 2,
                height: 32,
                my: 0.5,
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Card>
  );
}
