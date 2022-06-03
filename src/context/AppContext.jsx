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
    setKeywordsProcessed(
      processKeywords(article, keywords.phrases).filter((item) => item[0] != "")
    );
  }, [article, keywords]);

  useEffect(() => {
    const newKeywordsText = keywordsProcessed
      .map((item) => item[0].toLowerCase())
      .join("\n");
    setKeywords({ ...keywords, text: newKeywordsText });
  }, [disabled]);

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
      setRouter(newContext);
      setContext(newContext);
    }
  };

  const setDueDate = (text) => {
    const newContext = { ...context };
    newContext.dueDate = text;
    setRouter(newContext);
    setContext(newContext);
  };

  const split = (text) => {
    return text.split(": ");
  };

  const functionNames = {
    setTarget: setTarget,
    setDueDate: setDueDate,
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
