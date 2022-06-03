import { useState, useEffect } from "react";
import Head from "next/head";

import KeywordInput from "@components/KeywordInput/KeywordInput";
import ArticleInput from "@components/ArticleInput";
import NavBar from "@components/NavBar";

import styles from "@styles/Home.module.css";

import { useAppState } from "@context/AppContext";

export default function Home() {
  const {
    disabled,
    keywordsProcessed,
    setKeywordsProcessed,
    article,
    keywords,
    setKeywords,
  } = useAppState();

  return (
    <div className={styles.container}>
      <Head>
        <title>Phrases Tracker Tool</title>
        <meta
          name="Phrases Tracker Tool"
          content="Simple tracker to see how often keywords are used in an article"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />

      <main className={styles.main}>
        <div className={styles.columnWide}>
          <ArticleInput />
        </div>
        <div className={styles.columnNarrow}>
          <KeywordInput />
        </div>
      </main>
    </div>
  );
}
