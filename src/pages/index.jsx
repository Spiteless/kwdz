import Head from "next/head";
import { Box, Container, Button } from "@mui/material";

import KeywordInput from "@components/KeywordInput/KeywordDisplay";
import ArticleInput from "@components/ArticleInput";
import NavBar from "@components/NavBar";
import EdgePanel from "@components/EdgePanel/EdgePanel";
import { useAppState } from "@context/AppContext";
import { useThemeContext } from "@context/CustomThemeContext";

export default function Home({}) {
  const { title } = useAppState();
  const { activeTheme } = useThemeContext();

  return (
    <Container>
      <Head>
        <title>{title || "Phrases Tracker Tool"}</title>
        <meta
          name="Phrases Tracker Tool"
          content="Simple tracker to see how often keywords are used in an article"
        />
        {activeTheme.name ? (
          <link rel="icon" href={`/favicons/${activeTheme.name}/favicon.svg`} />
        ) : (
          <link rel="icon" href="/favicon.svg" />
        )}
      </Head>
      <NavBar />
      <EdgePanel />

      <Box as="main">
        <Box sx={{ my: 4 }}>
          <ArticleInput />
        </Box>
        <Box sx={{ my: 4 }}>
          <KeywordInput />
        </Box>
      </Box>
    </Container>
  );
}
