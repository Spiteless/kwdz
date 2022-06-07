import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import { processKeywords, getColor } from "@lib/processKeywords";

const AppContext = React.createContext();

export function useAppState() {
  return useContext(AppContext);
}

const initialContext = {
  target: false,
  dueDate: "",
  isLoaded: false,
  article: "",
  themeColor: "blue",
};

export function ContextProvider({ children }) {
  const router = useRouter();

  const [context, setContext] = useState(initialContext);
  const [disabled, setDisabled] = useState(false);
  const [keywords, setKeywords] = useState([]);
  const [keywordsProcessed, setKeywordsProcessed] = useState([]);
  const [article, setArticle] = useState("");
  const [forceRerender, setForceRerender] = useState(0);
  const [totalRenders, setTotalRenders] = useState(0);

  useEffect(() => {
    //Set application state via router from initial load
    const newContext = { ...context };

    newContext.isLoaded = true;
    newContext.target = router.query.target || false;
    newContext.dueDate = router.query.due || "";

    setContext(newContext);
  }, [router.isReady]);

  useEffect(() => {
    if (router.isReady) {
      updateKeywords(article, keywords);
    }
  }, [article, keywords, disabled, forceRerender]);

  useEffect(() => {
    // create inital keywords array
    let initialKW = [];
    const names = { kw: 0, k0: 0, k1: 1, k2: 2, k3: 3 };
    const query = router.query;

    for (const kw in names) {
      //if router.query[kw] exists
      if (!!router.query[kw]) {
        let group = router.query[kw];
        let tag = names[kw];
        if (typeof group === "string") {
          group = [group];
        }
        group.map((k) => {
          let val = {
            name: k.toLowerCase(),
            group: tag,
            count: 0,
            hidden: false,
          };
          initialKW.push(val);
        });
      }
    }

    updateKeywords("", initialKW);
  }, [router.isReady]);

  function setRouter(state) {
    const queryObj = {};

    if (state.keywords) {
      let kw = [...state.keywords];

      kw.reduce(
        (previousValue, currentValue) => {
          previousValue[currentValue.group].push(currentValue.name);
          return previousValue;
        },
        [[], [], [], []]
      ).map((group, index) => {
        if (group.length > 0) queryObj[`k${index}`] = [...group];
      });
    }

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
      newContext.keywords = keywords;
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
    let [func, ...vals] = text.split(": ");
    return [func, vals.join(": ")];
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

  const displayAll = () => {
    const newKeywords = updateKeywords("", keywords, { hidden: false });

    setForceRerender(forceRerender + 1);
    return "All keywords unhidden!";
  };

  const functionNames = {
    setTarget: setTarget,
    setDueDate: setDueDate,
    setArticle: setArticle,
    "copyMissingToClipboard()": copyToClipboard,
    "view - display all keywords()": displayAll,
  };

  const searchFuncs = {
    functionNames,
    split,
    setTarget,
    setArticle,
  };

  const updateKeywords = (article, keywords, ...args) => {
    const newKeywords = processKeywords(article, keywords, ...args);
    setKeywords(newKeywords);
    setTotalRenders(totalRenders + 1);
    return newKeywords;
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
    getColor,
    updateKeywords,
    totalRenders,
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
