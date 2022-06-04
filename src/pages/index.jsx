import { useState, useEffect } from "react";
import Head from "next/head";

import { Box, Container } from "@mui/material";

import KeywordInput from "@components/KeywordInput/KeywordInput";
import ArticleInput from "@components/ArticleInput";
import NavBar from "@components/NavBar";

// import styles from "@styles/Home.module.css";

export default function Home() {
  return (
    <Container>
      <Head>
        <title>Phrases Tracker Tool</title>
        <meta
          name="Phrases Tracker Tool"
          content="Simple tracker to see how often keywords are used in an article"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <Box as="main" >
        <Box sx={{my:4}}>
          <ArticleInput />
        </Box>
        <Box sx={{my:4}}>
          <KeywordInput />
        </Box>
      </Box>
    </Container>
  );
}
