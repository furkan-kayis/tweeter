import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/Nav/Navbar";
import BottomNav from "@/components/Nav/BottomNav";
import Providers from "@/providers";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/tweeter.svg" />
      </Head>
      <Providers>
        <Navbar />
        <Component {...pageProps} />
        <BottomNav />
      </Providers>
    </>
  );
}
