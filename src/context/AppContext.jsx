import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import processKeywords from "@lib/processKeywords";

const AppContext = React.createContext();

export function useAppState() {
  return useContext(AppContext);
}

const initialContext = {
  keywords: [],
  target: false,
  dueDate: "",
  isLoaded: false,
  article: {},
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
    newContext.keywords = router.query.kw || [];
    newContext.target = router.query.target || false;
    newContext.dueDate = router.query.due || "";

    setContext(newContext);
  }, [router.isReady]);

  function setRouter(state) {
    const queryObj = {};

    if (state.keywords) queryObj.kw = state.keywords;
    if (state.dueDate) queryObj.due = state.queryDate;
    if (state.target) queryObj.target = state.target;

    let query = "/?" + queryString.stringify(queryObj);

    router.push(query, undefined, { shallow: true });
  }

  // function setKeywords(keywords) {}

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
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
