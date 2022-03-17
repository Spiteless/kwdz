import { useEffect } from "react";
import { useRouter } from 'next/router'
import { TextField, Button, ButtonGroup } from '@material-ui/core'

export default function KeywordInput(props) {
  const {
    keywords,
    setKeywords,
    keywordsProcessed,
    disabled,
    setDisabled,
    runCounter,
    setRunCounter
  } = props

  const router = useRouter()

  useEffect(() => {
    if (
      !!router.query.kw &&
      runCounter < 1
    ) {
      const queryKeywords = router.query.kw
      const newState = { ...queryKeywords }
      if (typeof (queryKeywords) === "string") {
        newState.phrases = [queryKeywords]
        newState.text = queryKeywords
      } else {
        newState.phrases = queryKeywords
        newState.text = queryKeywords.join("\n")
      }
      setKeywords(newState)
      setRunCounter(runCounter + 1)
    }
  }, [router.query.kw])

  const copyToClipboard = (e, limiter) => {
    let text = ""
    if (limiter === 0) {
      text = keywordsProcessed.filter(val => val[1] === 0)
        .map(item => `${item[0]}`).join("\n")
    } else {
      text = keywordsProcessed.map(item => `${item[1]} ${item[0]}`).join("\n")
    }
    navigator.clipboard.writeText(text)
    e.target.focus();
  };

  const handleKeywordsChange = (e) => {
    const newState = { ...keywords }
    newState.text = e.target.value
    newState.phrases = e.target.value.replace("\r", "").split("\n")
    setKeywords(newState)
    if (newState.phrases.length > 0) {
      router.push(`/?kw=${[...newState.phrases]
        .filter(n => n.length > 0)
        .join("&kw=")
        }`, undefined, { shallow: true })
    } else {
      router.push(`/`, undefined, { shallow: true })
    }
  }

  return (
    <>
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
          : "Enter keywords to begin - New line for each term."}
        onFocus={() => { setDisabled(false) }}
        onBlur={() => { setDisabled(true) }}
        fullWidth
        multiline
        rows={25}
      />
      <ButtonGroup fullWidth style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        whiteSpace: 'nowrap'
      }}>
        <Button
          style={{ marginTop: 5, minWidth: 140 }}
          variant="outlined"
          color="primary"
          onClick={(e) => copyToClipboard(e, 9999)}
        >
          Copy All
          </Button>
        <Button
        style={{ marginTop: 5, minWidth: 140 }}
        variant="outlined"
        color="primary"
        onClick={(e) => copyToClipboard(e, 0)}
        >Copy Missing</Button>
      </ButtonGroup>
    </>
  )
}