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
  keywords: {},
  themeColor: "blue",
};

export function ContextProvider({ children }) {
  const router = useRouter();

  const [context, setContext] = useState(initialContext);

  const [keywords, setKeywords] = useState([]);
  const [targ, setTarg] = useState(false);
  const [due, setDue] = useState("");

  const [article, setArticle] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);
  const [totalRenders, setTotalRenders] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  // const keywordEntryRef = useRef(null);

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
    console.log("openDrawer()");
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
    if (router.isReady) {
      updateKeywords(article, keywords);
    }
    console.log("[article, keywords, disabled, forceRerender]");
  }, [article, keywords, disabled, forceRerender]);

  useEffect(() => {
    //this useEffect is for setting Router
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
  }, [keywords, targ, due]);

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

  // function setRouter(state) {
  //   const queryObj = {};

  //   if (state.keywords) {
  //     let kw = [...state.keywords];

  //     kw.reduce(
  //       (previousValue, currentValue) => {
  //         previousValue[currentValue.group].push(currentValue.name);
  //         return previousValue;
  //       },
  //       [[], [], [], []]
  //     ).map((group, index) => {
  //       if (group.length > 0) queryObj[`k${index}`] = [...group];
  //     });
  //   }

  //   if (state.dueDate) queryObj.due = state.dueDate;
  //   if (state.target) queryObj.target = state.target;

  //   let query = "/?" + queryString.stringify(queryObj);

  //   router.push(query, undefined, { shallow: true });
  // }

  const setTarget = (text) => {
    const num = parseInt(text);
    if (Number.isInteger(num)) {
      setTarg(num);
      return "Target Set!";
    } else {
      return "Target Not Set :(";
    }
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
    // keywordEntryRef,
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
