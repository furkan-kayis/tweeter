import ToggleColorMode from "./contexts/ColorMode";
import TweetFilterProvider from "./contexts/TweetFilter";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TweetFilterProvider>
      <ToggleColorMode>{children}</ToggleColorMode>
    </TweetFilterProvider>
  );
}
