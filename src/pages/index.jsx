import { useState, useEffect } from "react";
import Head from "next/head";

import { Box, Container } from "@mui/material";

import KeywordInput from "@components/KeywordInput/KeywordInput";
import ArticleInput from "@components/ArticleInput";
import NavBar from "@components/NavBar";
import EdgePanel from "@components/EdgePanel";

// import styles from "@styles/Home.module.css";

export default function Home() {

  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return; //Don't do anything on Tab or Shift keypress
    }

    setDrawerOpen(open);
    console.log("toggleDrawer", event.type, open);
  };

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

      <NavBar toggleDrawer={toggleDrawer} />
      <EdgePanel mobileOpen={drawerOpen} toggleDrawer={toggleDrawer} />

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
