import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  Stack,
  useMediaQuery,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Route } from "@/types";
import { ROUTES } from "@/constants";
import { getRoutePath, getTabIndex } from "@/lib/utils";
import { useAuth } from "@/hooks/firebase";

function RouteIcon({ route }: { route: Route }) {
  return route === "Home" ? (
    <HomeRoundedIcon />
  ) : route === "Explore" ? (
    <ExploreRoundedIcon />
  ) : route === "Bookmarks" ? (
    <BookmarkRoundedIcon />
  ) : null;
}

export default function BottomNav() {
  const pathName = usePathname();
  const activeTabIndex = getTabIndex(pathName);
  const [auth] = useAuth();
  const matches = useMediaQuery("(max-width:50em)");

  if (!auth && pathName === "/") {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
        bgcolor="background.paper"
        position="fixed"
        height={65}
        bottom={0}
        left={0}
        right={0}
      >
        {!matches && <Box>Don’t miss what’s happening</Box>}
        <Button LinkComponent={Link} href="sign-in">
          Sign in
        </Button>
        <Button LinkComponent={Link} href="sign-up">
          Sign up
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ mt: 10, height: "max-content" }}>
      {matches && auth && (
        <BottomNavigation
          value={activeTabIndex}
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            left: 0,
            zIndex: 50,
            height: 70,
          }}
        >
          {ROUTES.map((route) => (
            <BottomNavigationAction
              key={route}
              LinkComponent={Link}
              href={getRoutePath(route)}
              icon={<RouteIcon route={route} />}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}
