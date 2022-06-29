import Head from "next/head";
import { Box, Container, Button } from "@mui/material";

import KeywordInput from "@components/KeywordInput/KeywordDisplay";
import ArticleInput from "@components/ArticleInput";
import NavBar from "@components/NavBar";
import EdgePanel from "@components/EdgePanel/EdgePanel";

export default function Home({}) {

  return (
    <Container>
      <Head>
        <title>Phrases Tracker Tool</title>
        <meta
          name="Phrases Tracker Tool"
          content="Simple tracker to see how often keywords are used in an article"
        />
        <link rel="icon" href="/favicon.svg" />
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
