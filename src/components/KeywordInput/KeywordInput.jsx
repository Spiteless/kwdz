import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TextField, Button, ButtonGroup } from "@mui/material";

import { useAppState } from "@context/AppContext";

export default function KeywordInput(props) {
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

  const copyToClipboard = (e) => {
    let text = "";
    text = keywordsProcessed
      .filter((val) => val[1] === 0)
      .map((item) => `${item[0]}`)
      .join("\n");
    text = "%% MISSING WORDS\n" + text + "\n%%";
    navigator.clipboard.writeText(text);
    e.target.focus();
  };

  const handleKeywordsChange = (e) => {
    const newState = { ...keywords };
    newState.text = e.target.value;
    newState.phrases = e.target.value.replace("\r", "").split("\n");
    setKeywords(newState);

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
        minRows={2}
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
          onClick={copyToClipboard}
        >
          Copy All
        </Button>
        <Button
          style={{ marginTop: 5, minWidth: 140 }}
          variant="outlined"
          color="primary"
          onClick={copyToClipboard}
        >
          Copy Missing
        </Button>
      </ButtonGroup>
    </>
  );
}
