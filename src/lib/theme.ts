import { createTheme } from "@mui/material";
import { Poppins } from "next/font/google";

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const theme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
    allVariants: { letterSpacing: "-0.02625em", wordBreak: "break-word" },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        sx: { textTransform: "capitalize" },
        TouchRippleProps: { hidden: true },
      },
    },
    MuiTab: {
      defaultProps: {
        TouchRippleProps: { hidden: true },
      },
    },
  },
});

export default theme;
