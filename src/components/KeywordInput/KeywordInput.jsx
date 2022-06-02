import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, ButtonGroup } from '@mui/material'

import { useAppState } from "@context/AppContext";

export default function KeywordInput(props) {
  const {
    // keywords,
    // setKeywords,
    // keywordsProcessed,
    // disabled,
    // setDisabled,
    // runCounter,
  } = props;

  const router = useRouter();
  const appState = useAppState();
  const {
    context,
    setContext,
    keywords,
    setKeywords,
    keywordsProcessed,
    setKeywordsProcessed,
    setRouter,
    setDisabled,
    disabled,
  } = useAppState();


  useEffect(() => {
    if (!!router.query.kw ) {
      const queryKeywords = router.query.kw;
      const newState = { ...queryKeywords };
      if (typeof queryKeywords === "string") {
        newState.phrases = [queryKeywords];
        newState.text = queryKeywords;
      } else {
        newState.phrases = queryKeywords;
        newState.text = queryKeywords.join("\n");
      }
      setKeywords(newState);
    }
  }, [router.query.kw]);

  const copyToClipboard = (e, limiter) => {
    let text = "";
    if (limiter === 0) {
      text = keywordsProcessed
        .filter((val) => val[1] === 0)
        .map((item) => `${item[0]}`)
        .join("\n");
      text = "%% MISSING WORDS\n" + text + "\n%%";
    } else {
      text = keywordsProcessed
        .map((item) => `${item[1]} ${item[0]}`)
        .join("\n");
      text = "%% WORDS COUNT\n" + text + "\n%%";
    }
    navigator.clipboard.writeText(text);
    e.target.focus();
  };

  const [temp, setTemp] = useState("initial temp");

  const handleKeywordsChange = (e) => {
    const newState = { ...keywords };
    newState.text = e.target.value;
    newState.phrases = e.target.value.replace("\r", "").split("\n");
    setKeywords(newState);
    if (newState.phrases.length > 0) {
      let newQuery = `/?kw=${[...newState.phrases]
        .filter((n) => n.length > 0)
        .join("&kw=")}`;
      // router.push(newQuery, undefined, { shallow: true });
      setTemp(newState.phrases);
    } else {
      // router.push(`/`, undefined, { shallow: true });
    }

    const newAppState = { ...appState.context };
    newAppState.keywords = [...newState.phrases];
    setRouter(newAppState);
  };

  return (
    <>
      {/* <pre>{keywordsProcessed}</pre> */}
      <TextField
        name="keywordField"
        value={
          disabled
            ? keywordsProcessed
                .map((item) => `${item[1]} ${item[0]}`)
                .join("\n")
            : keywords.text
        }
        onChange={handleKeywordsChange}
        variant="outlined"
        color="secondary"
        label={
          keywordsProcessed.length > 0
            ? `Unused Keywords: ${
                keywordsProcessed.filter((item) => item[1] === 0).length
              }/${keywordsProcessed.length}`
            : "Enter keywords to begin - New line for each term."
        }
        onFocus={() => {
          setDisabled(false);
        }}
        onBlur={() => {
          setDisabled(true);
        }}
        fullWidth
        multiline
        rows={25}
      />
      <ButtonGroup
        fullWidth
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexGrow: 1,
          whiteSpace: "nowrap",
        }}
      >
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
        >
          Copy Missing
        </Button>
      </ButtonGroup>
    </>
  );
}
