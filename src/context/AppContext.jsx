import React, { useContext, useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import queryString from "query-string";

import { processKeywords, getColor } from "@lib/processKeywords";
import { copyToClipboard } from "@lib/clipboard";

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
  const [article, setArticle] = useState("");
  const [forceRerender, setForceRerender] = useState(0);
  const [totalRenders, setTotalRenders] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const keywordEntryRef = useRef(null);

  const toggleDrawer = (openState) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return; //Don't do anything on Tab or Shift keypress
    }
    setDrawerOpen(openState);
  };

  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    //Set application state via router from initial load
    const newContext = { ...context };

    newContext.isLoaded = true;
    newContext.target = router.query.target || false;
    newContext.dueDate = router.query.due || "";

    setContext(newContext);
  }, [router.isReady]);

  useEffect(() => {
    //main update useEffect for application
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

  function initializeNewKeywords(newKeywordsText, article) {
    let initialKW = [];
    let group = newKeywordsText
      .replace("\r", "")
      .split("\n")
      .filter((k) => k.length > 0);

    group.map((k) => {
      let val = {
        name: k.toLowerCase(),
        group: 0,
        count: 0,
        hidden: false,
      };
      initialKW.push(val);
    });
    updateKeywords(article, initialKW);
  }

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

  // there is a structural change available here to allow
  // single properties to be sent with setRouter
  // so that the application is pulling the last known state
  // plus the new state that needs handling

  // eg
  // setRouter(newProperties) {
  //   let newState = { ... oldState, ...newProperties}
  // }

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

  const unhideAll = () => {
    updateKeywords("", keywords, { hidden: false });
    setForceRerender(forceRerender + 1);
    return "All keywords unhidden!";
  };

  const openKeywordField = () => {
    setDrawerOpen(true);
    setTimeout(() => {
      let f1 = document.getElementById("keywordField").focus();
      // let f2 = keywordEntryRef.current && keywordEntryRef.current.focus();
    }, 25);
  };

  const functionNames = {
    "Set target": { func: setTarget },
    "Set due date": { func: setDueDate },
    "Set article": { func: setArticle },
    "Set keywords()": { func: openKeywordField },
    "Copy missing to clipboard()": { func: copyToClipboard, args: keywords },
    "View - unhide all keywords()": { func: unhideAll },
  };

  const searchFuncs = {
    functionNames,
    split,
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
    article,
    setArticle,
    searchFuncs,
    getColor,
    updateKeywords,
    totalRenders,
    initializeNewKeywords,
    forceRerender,
    setForceRerender,
    drawerOpen,
    setDrawerOpen,
    toggleDrawer,
    closeDrawer,
    keywordEntryRef,
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
