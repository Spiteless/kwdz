import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import processKeywords from "@lib/processKeywords";

const AppContext = React.createContext();

export function useAppState() {
  return useContext(AppContext);
}

const initialContext = {
  target: false,
  dueDate: "",
  isLoaded: false,
  article: "",
};

export function ContextProvider({ children }) {
  const router = useRouter();

  const [context, setContext] = useState(initialContext);
  const [disabled, setDisabled] = useState(false);
  const [keywords, setKeywords] = useState({ text: "", phrases: [] });
  const [text, setText] = useState("");
  const [phrases, setPhrases] = useState([]);
  const [keywordsProcessed, setKeywordsProcessed] = useState([]);
  const [article, setArticle] = useState("");

  useEffect(() => {
    //Set application state via router from initial load
    const newContext = { ...context };

    newContext.isLoaded = true;
    newContext.target = router.query.target || false;
    newContext.dueDate = router.query.due || "";

    setContext(newContext);
  }, [router.isReady]);

  useEffect(() => {
    const newKeywordsProcessed = processKeywords(article, keywords.phrases);
    setKeywordsProcessed(newKeywordsProcessed);
  }, [article, keywords]);

  useEffect(() => {
    const newKeywordsText = Object.keys(keywordsProcessed)
      .map((item) => item[0].toLowerCase())
      .join("\n");
    setKeywords({ ...keywords, text: newKeywordsText });
  }, [disabled]);

  useEffect(() => {
    if (!!router.query.kw) {
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

  function setRouter(state) {
    const queryObj = {};

    if (state.keywords) queryObj.kw = state.keywords;
    if (state.dueDate) queryObj.due = state.dueDate;
    if (state.target) queryObj.target = state.target;

    let query = "/?" + queryString.stringify(queryObj);

    router.push(query, undefined, { shallow: true });
  }

  const setTarget = (text) => {
    const num = parseInt(text);
    if (Number.isInteger(num)) {
      const newContext = { ...context };
      newContext.target = num;
      newContext.keywords = keywordsProcessed.map((k) => k.name);
      setRouter(newContext);
      setContext(newContext);
      return "Target Set!";
    } else {
      return "Target Not Set :(";
    }
  };

  const setDueDate = (text) => {
    const newContext = { ...context };
    newContext.dueDate = text;
    setRouter(newContext);
    setContext(newContext);

    return "DueDate Set!";
  };

  const split = (text) => {
    return text.split(": ");
  };

  const copyToClipboard = (e) => {
    let text = "";
    text = keywordsProcessed
      .filter((val) => val.count === 0)
      .map((val) => val.name)
      .join("\n");
    text = "%% MISSING WORDS\n" + text + "\n%%";
    navigator.clipboard.writeText(text);
    return "Clipboard Set!";
  };

  const functionNames = {
    setTarget: setTarget,
    setDueDate: setDueDate,
    "copyMissingToClipboard()": copyToClipboard,
  };

  const searchFuncs = {
    functionNames,
    split,
    setTarget,
  };

  const exports = {
    context,
    setContext,
    setRouter,
    disabled,
    setDisabled,
    keywords,
    setKeywords,
    keywordsProcessed,
    setKeywordsProcessed,
    article,
    setArticle,
    searchFuncs,
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
