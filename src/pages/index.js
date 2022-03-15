import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { TextField, Button, ButtonGroup } from '@material-ui/core'
import { border } from '@material-ui/system'

import styles from '../styles/Home.module.css'

export default function Home() {
  const [article, setArticle] = useState("")
  const [keywords, setKeywords] = useState({ text: "", phrases: [] })
  const [disabled, setDisabled] = useState(false)
  const [mappedWords, setMappedWords] = useState({})
  const [keywordsProcessed, setKeywordsProcessed] = useState([])

  const router = useRouter()
  console.log("router.query----------------------------------", typeof(router.query), router.query)
  console.log("router.query.kw", typeof(router.query.kw), router.query.kw)

  const handelArticleChange = (e) => {
    setArticle(e.target.value)
    setMappedWords(wordMap(article))
    setDisabled(true)
  }

  useEffect(() => {
    if (router.query.kw) { 
      const queryKeywords = router.query.kw
      const newState = { ...queryKeywords }
      newState.text = queryKeywords.join("\n")
      newState.phrases = queryKeywords
      console.log("queryKeywords", queryKeywords)
      setKeywords(newState)
    } else {
      console.log("!!router.query.kw empty", router.query.kw)
    }
  }, [router.query])

  const handleKeywordsChange = (e) => {
    const newState = { ...keywords }
    newState.text = e.target.value
    newState.phrases = e.target.value.replace("\r", "").split("\n")
    setKeywords(newState)
  }

  useEffect(() => {
    setMappedWords(wordMap(article))
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

  const cleanString = (str) => {
    return str.replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  const extractSubstr = (str, regexp) => {
    return cleanString(str).match(regexp) || [];
  }

  const getWordsByNonWhiteSpace = (str) => {
    return extractSubstr(str, /\S+/g);
  }

  const getWordsByWordBoundaries = (str) => {
    return extractSubstr(str, /\b[a-z\d]+\b/g);
  }

  const wordMap = (str) => {
    return getWordsByNonWhiteSpace(str).reduce((map, word) => {
      // return getWordsByWordBoundaries(str).reduce((map, word) => {
      map[word] = (map[word] || 0) + 1;
      return map;
    }, {});
  }

  const mapToTuples = (map) => {
    return Object.keys(map).map((key) => {
      return [key, map[key]];
    });
  }

  const mapToSortedTuples = (map, sortFn, sortOrder) => {
    return mapToTuples(map).sort((a, b) => {
      return sortFn.call(undefined, a, b, sortOrder);
    });
  }

  const countWords = (str) => {
    return getWordsByWordBoundaries(str).length;
  }

  const wordFrequency = (str) => {
    return mapToSortedTuples(wordMap(str), (a, b, order) => {
      if (b[1] > a[1]) {
        return order[1] * -1;
      } else if (a[1] > b[1]) {
        return order[1] * 1;
      } else {
        return order[0] * (a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0));
      }
    }, [1, -1]);
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

  const copyToClipboard = (e, limiter) => {
    console.log("limiter:", limiter)
    navigator.clipboard.writeText(limiter === 0
      ? keywordsProcessed.filter(val => val[1] === limiter).map(item => `${item[1]} ${item[0]}`).join("\n")
      : keywordsProcessed.map(item => `${item[1]} ${item[0]}`).join("\n"))
    e.target.focus();
  };

  return (
    <div className={styles.container}>
      { console.log("keywords:",keywords)}
      <Head>
        <title>SEO Keywords Tracker</title>
        <meta name="description" content="Simple tracker to see how often keywords are used in an article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <div className={styles.columnWide}>
          <TextField
            name='article'
            value={article}
            id="article"
            label={`Word Count: ${countWords(article)}`}
            placeholder="Paste article text here."
            multiline
            variant="outlined"
            onChange={handelArticleChange}
            onClick={() => setDisabled(true)}
            fullWidth
            rows={25}
          // onFocus={() => { setDisabled(true) }}
          />
        </div>
        <div className={styles.columnNarrow}>
          <TextField
            name='keywordField'
            value={
              disabled
                ? keywordsProcessed.map(item => `${item[1]} ${item[0]}`).join("\n")
                : keywords.text
            }
            onChange={handleKeywordsChange}
            variant="outlined"
            color="secondary"
            label={keywordsProcessed.length > 0
              ? `Unused Keywords: ${keywordsProcessed.filter(item => item[1] === 0).length}`
              : "Enter keywords to begin - new term for each line."}
            onFocus={() => { setDisabled(false) }}
            onBlur={() => { setDisabled(true) }}
            fullWidth
            multiline

            rows={25}
          />
          <ButtonGroup fullWidth style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
            <Button style={{ marginTop: 5}} variant="outlined" color="primary"
              onClick={(e) => copyToClipboard(e, 9999)}
            >Copy All</Button>
            <Button style={{ marginTop: 5}} variant="outlined" color="primary"
              onClick={(e) => copyToClipboard(e, 0)}
            >Copy Missing</Button>
          </ButtonGroup>
        </div>
      </main>
    </div>
  )
}
