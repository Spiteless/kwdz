import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

import { processKeywords, getColor, clean } from "@lib/processKeywords";
import { copyToClipboard } from "@lib/clipboard";
import { useThemeContext } from "./CustomThemeContext";

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
  const { toggleTheme, activeTheme } = useThemeContext();

  const [context, setContext] = useState(initialContext);

  const [keywords, setKeywords] = useState([]);
  const [targ, setTarg] = useState(false);
  const [due, setDue] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");

  const [article, setArticle] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);
  const [updateRouter, setUpdateRouter] = useState(0);
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

    // create inital keywords array
    let initialKW = [];
    const names = { kw: 0, k0: 0, k1: 1, k2: 2, k3: 3 };

    let parsed = queryString.parse(router.asPath.replace("/?", ""));

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
            name: k.toLowerCase().trim(),
            group: tag,
            count: 0,
            hidden: false,
          };
          initialKW.push(val);
        });
      }
    }

    if (parsed.theme) toggleTheme_(parsed.theme);
    if (parsed.due) setDue_(parsed.due);
    if (parsed.target) setTarget_(parsed.target);
    if (parsed.title) setTitle_(parsed.title);

    if (initialKW) updateKeywords("", initialKW);
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

    if (activeTheme) queryObj.theme = activeTheme.name  ;
    if (due) queryObj.due = due;
    if (targ) queryObj.target = targ;
    if (title) queryObj.title = title;

    console.log(activeTheme.name, updateRouter)

    let query = "/?" + queryString.stringify(queryObj);
    router.push(query, undefined, { shallow: true });
  }, [updateRouter]);

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

  const setTarget_ = (text) => {
    const num = parseInt(text);
    if (Number.isInteger(num)) {
      setTarg(num);
      setUpdateRouter(updateRouter + 1);
      return "Target Set!";
    } else {
      return "Target Not Set :(";
    }
  };

  const setTitle_ = (text) => {
    setTitle(text);
    setUpdateRouter(updateRouter + 1);
    return "Title Set!";
  };

  const setArticle_ = (text) => {
    setArticle(clean(text));
    setForceRerender(forceRerender + 1);
    return "Article Set!";
  };

  const setDue_ = (text) => {
    setDue(text);
    setUpdateRouter(updateRouter + 1);
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

  const toggleTheme_ = (theme) => {
    toggleTheme(theme);
    setUpdateRouter(updateRouter + 1);
    return `Theme set to ${theme}!`
  };

  const functionNames = {
    "Set target": { func: setTarget_ },
    "Set due date": { func: setDue_ },
    "Set title": { func: setTitle_ },
    "Set article": { func: setArticle_ },
    "Set keywords()": { func: openKeywordField },
    "Copy missing to clipboard()": { func: copyToClipboard, args: keywords },
    "View - unhide all keywords()": { func: unhideAll },
    "Theme - toggle theme()": { func: toggleTheme_, args: false },
    "Theme - set theme()": { func: toggleTheme_ },
  };

  const searchFuncs = {
    functionNames,
    split,
  };

  const updateKeywords = (article, keywords, ...args) => {
    const newKeywords = processKeywords(article, keywords, ...args);
    setKeywords(newKeywords);
    setUpdateRouter(updateRouter + 1);

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
    targ,
    due,
    updateRouter,
    toggleTheme: toggleTheme_,
  };

  return <AppContext.Provider value={exports}>{children}</AppContext.Provider>;
}
