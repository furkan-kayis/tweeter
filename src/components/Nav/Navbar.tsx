import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { signOutUser } from "@/firebase/auth";
import { AccountCircleRounded, ExitToAppRounded } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs as MuiTabs,
  Toolbar,
  useMediaQuery,
  Typography,
  useTheme,
  Divider,
} from "@mui/material";
import { ROUTES } from "@/constants";
import { getRoutePath, getTabIndex } from "@/lib/utils";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { UserDocument } from "@/firebase/types";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useColorMode } from "@/contexts/ColorMode";
import useUser from "@/hooks/useUser";
import { useAuth } from "@/hooks/firebase";

function Tabs() {
  const pathName = usePathname();
  const activeTabIndex = getTabIndex(pathName);

  return (
    <Box sx={{ width: "100%" }}>
      <MuiTabs
        value={activeTabIndex}
        centered
        TabIndicatorProps={{
          sx: {
            height: 3,
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          },
        }}
      >
        {ROUTES.map((route, index) => (
          <Tab
            key={route}
            LinkComponent={Link}
            href={getRoutePath(route)}
            label={route}
            sx={{
              textTransform: "none",
              ...(activeTabIndex === index && { fontWeight: 600 }),
            }}
          />
        ))}
      </MuiTabs>
    </Box>
  );
}

function UserMenu({ user, name }: { user: UserDocument; name: string | null }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const theme = useTheme();
  const colorMode = useColorMode();

  return (
    <Stack direction="row" gap={3}>
      <Button
        variant="text"
        aria-label="account of current user"
        ref={anchorRef}
        id="composition-button"
        aria-controls={open ? "composition-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
        sx={{ textTransform: "capitalize", display: "flex", gap: 1.5 }}
      >
        <Avatar
          variant="rounded"
          src={user.photoUrl}
          sx={{ width: 32, height: 32, borderRadius: 2 }}
        />
        {name && (
          <>
            <Typography noWrap lineHeight={1} fontSize={12} fontWeight={700}>
              {name}
            </Typography>
            <ArrowDropDownRoundedIcon />
          </>
        )}
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role="menu"
        placement="bottom-start"
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
              borderRadius: 12,
              padding: 12,
              width: 192,
              marginTop: 10,
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                  sx={{ display: "grid", gap: 1, p: 0 }}
                >
                  <MenuItem
                    LinkComponent={Link}
                    onClick={handleClose}
                    sx={{ borderRadius: 2 }}
                  >
                    <Link
                      href={`/profile/${user.id}`}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignContent: "space-between",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "inherit",
                        fontSize: 12,
                        fontWeight: 500,
                        lineHeight: 1,
                      }}
                    >
                      <AccountCircleRounded sx={{ fontSize: 20 }} /> My Profile
                    </Link>
                  </MenuItem>
                  <MenuItem
                    sx={{
                      display: "flex",
                      flexGrow: 1,
                      alignItems: "center",
                      borderRadius: 2,
                      gap: 1,
                      textTransform: "capitalize",
                    }}
                    style={{ fontSize: 12, fontWeight: 500, lineHeight: 1 }}
                    onClick={colorMode.toggleColorMode}
                  >
                    {theme.palette.mode === "dark" ? (
                      <Brightness7Icon sx={{ fontSize: 20 }} />
                    ) : (
                      <Brightness4Icon sx={{ fontSize: 20 }} />
                    )}
                    {theme.palette.mode} mode
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={(event) => {
                      signOutUser();
                      handleClose(event);
                    }}
                    sx={{
                      display: "flex",
                      gap: 1,
                      borderRadius: 2,
                      color: "red",
                    }}
                    style={{ fontSize: 12, fontWeight: 500, lineHeight: 1 }}
                  >
                    <ExitToAppRounded sx={{ fontSize: 20 }} /> Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
}

export default function Navbar() {
  const [auth] = useAuth();
  const authUser = useUser(auth?.uid);
  const matches = useMediaQuery("(min-width:50em)");

  return (
    <AppBar position="sticky" color="inherit" sx={{ mb: 3 }}>
      <Toolbar variant="dense">
        <Container
          maxWidth="xl"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
              gap: 10,
            }}
          >
            <Image
              src="/tweeter.svg"
              width="41"
              height="30"
              alt="Logo"
              priority
            />
            {matches && (
              <Typography
                noWrap
                color="inherit"
                lineHeight={1.5}
                fontSize={18}
                fontWeight={600}
                letterSpacing="-0.03938em"
              >
                Tweeter
              </Typography>
            )}
          </Link>
          {matches && authUser && <Tabs />}
          {authUser && (
            <UserMenu
              user={authUser}
              name={matches ? authUser.displayName : null}
            />
          )}
        </Container>
      </Toolbar>
    </AppBar>
  );
}
