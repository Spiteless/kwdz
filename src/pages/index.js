import { useState, useEffect } from 'react'
import Head from 'next/head'

import KeywordInput from '../components/KeywordInput/KeywordInput.js'
import ArticleInput from '../components/ArticleInput/ArticleInput.js'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [article, setArticle] = useState("")
  const [keywords, setKeywords] = useState({ text: "", phrases: [] })
  const [disabled, setDisabled] = useState(false)
  const [keywordsProcessed, setKeywordsProcessed] = useState([])
  const [runCounter, setRunCounter] = useState(0)

  useEffect(() => {
    setKeywordsProcessed(processKeywords(article).filter(item => item[0] != ""))
  }, [article, keywords])

  useEffect(() => {
    const newKeywordsText = keywordsProcessed.map(item => item[0].toLowerCase()).join("\n")
    setKeywords({ ...keywords, text: newKeywordsText })
  }, [disabled])

  const processKeywords = (str) => {
    const output = []
    keywords.phrases.map(key => {
      output.push([key, occurrences(str.toLowerCase(), key.toLowerCase())])
    })
    output.sort((a, b) => {
      if (a[0].toLowerCase() < b[0].toLowerCase()) return -1
      if (a[0].toLowerCase() > b[0].toLowerCase()) return 1
      return 0
    })
    output.sort((a, b) => {
      return a[1] - b[1]
    })
    return output
  }

  const occurrences = (string, subString, allowOverlapping = false) => {

    string += "";
    subString += "";

    if (subString.length <= 0) return (string.length + 1);

    let n = 0,
      pos = 0,
      step = allowOverlapping ? 1 : subString.length;

    while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
        ++n;
        pos += step;
      } else break;
    }
    return n;
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>SEO Keywords Tracker</title>
        <meta name="description" content="Simple tracker to see how often keywords are used in an article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <div className={styles.columnWide}>
          <ArticleInput
            article={article}
            setArticle={setArticle}
            setDisabled={setDisabled}
          />
        </div>
        <div className={styles.columnNarrow}>
          <KeywordInput
            keywords={keywords}
            setKeywords={setKeywords}
            keywordsProcessed={keywordsProcessed}
            setKeywordsProcessed={setKeywordsProcessed}
            disabled={disabled}
            setDisabled={setDisabled}
            runCounter={runCounter}
            setRunCounter={setRunCounter}
          />
        </div>
      </main>
    </div>
  )
}
