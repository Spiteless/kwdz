import React, { useContext, useState, useEffect, useRef } from "react";
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
  keywords: [],
  themeColor: "blue",
  title: "Tracker",
};

export function ContextProvider({ children }) {
  const router = useRouter();

  const [context, setContext] = useState(initialContext);

  const [keywords, setKeywords] = useState([]);
  const [targ, setTarg] = useState(false);
  const [due, setDue] = useState("");
  const [title, setTitle] = useState("");

  const [article, setArticle] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);
  const [totalRenders, setTotalRenders] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);

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

  const openDrawer = () => {
    setTimeout(() => {
      document.getElementById("keywordField").focus();
    }, 25);
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    //Set application state via router from initial load
    const newContext = { ...context };

    newContext.isLoaded = true;
    newContext.target = router.query.target || false;
    newContext.dueDate = router.query.due || "";

    if (
      // open drawer if there are no keywords
      router.isReady &&
      !router.query.kw &&
      !router.query.k0 &&
      !router.query.k1 &&
      !router.query.k2 &&
      !router.query.k3
    ) {
      openDrawer();
    }
    setContext(newContext);
  }, [router.isReady]);

  useEffect(() => {
    //main update useEffect for application
    let newKeywords;
    if (router.isReady) {
      newKeywords = updateKeywords(article, keywords);
    }
  }, [article, keywords, disabled, forceRerender, router.isReady]);

  useEffect(() => {
    // keep router up to date
    let queryObj = {};

    keywords
      .reduce(
        (previousValue, currentValue) => {
          previousValue[currentValue.group].push(currentValue.name);
          return previousValue;
        },
        [[], [], [], []]
      )
      .map((group, index) => {
        if (group.length > 0 && group[0]) {
          queryObj[`k${index}`] = [...group];
        }
      });

    if (due) queryObj.due = due;
    if (targ) queryObj.target = targ;

    let query = "/?" + queryString.stringify(queryObj);
    router.push(query, undefined, { shallow: true });
  }, [keywords, targ, due, title]);

  useEffect(() => {
    // create inital keywords array
    let initialKW = [];
    const names = { kw: 0, k0: 0, k1: 1, k2: 2, k3: 3 };

    let parsed = queryString.parse(router.asPath.replace("/?",""))

    for (const kw in names) {
      //if router.query[kw] exists
      if (!!parsed[kw]) {
        let group = parsed[kw];
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
    let resultInitialKw;
    if (initialKW) {
      resultInitialKw = updateKeywords("", initialKW);
    }
  }, [router.isReady]);

  function createNewKeywords(newKeywordsText, article) {
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

  /*
  ------------------------------
  */

  const setTarget = (text) => {
    const num = parseInt(text);
    if (Number.isInteger(num)) {
      setTarg(num);
      return "Target Set!";
    } else {
      return "Target Not Set :(";
    }
  };

  const setTitle_ = (text) => {
    setTitle(text);
    return "Title Set!";
  };

  const setDueDate = (text) => {
    setDue(text);
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
      document.getElementById("keywordField").focus();
    }, 25);
  };

  const functionNames = {
    "Set target": { func: setTarget },
    "Set due date": { func: setDueDate },
    "Set title": { func: setTitle_ },
    "Set article": { func: setArticle },
    "Set keywords()": { func: openKeywordField },
    "Copy missing to clipboard()": { func: copyToClipboard, args: keywords },
    "View - unhide all keywords()": { func: unhideAll },
  };

  const searchFuncs = {
    functionNames,
    split,
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
    createNewKeywords,
    forceRerender,
    setForceRerender,
    drawerOpen,
    setDrawerOpen,
    toggleDrawer,
    closeDrawer,
    openDrawer,
    wordCount,
    setWordCount,
    title,
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
