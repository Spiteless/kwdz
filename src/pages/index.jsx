import { useState, useEffect } from "react";
import Head from "next/head";

import { Box, Container } from "@mui/material";

import KeywordInput from "@components/KeywordInput/KeywordInput";
import ArticleInput from "@components/ArticleInput";
import NavBar from "@components/NavBar";
import EdgePanel from "@components/EdgePanel";
import { useAppState } from "@context/AppContext";

// import styles from "@styles/Home.module.css";

export default function Home() {
  const { mainRef } = useAppState();

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
