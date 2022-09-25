import React, { useContext, useState, useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useRouter } from "next/router";
import queryString from "query-string";

import { processKeywords, getColor, clean } from "@lib/processKeywords";
import { copyToClipboard } from "@lib/clipboard";
import {
  reduceToArrays,
  createKeywordsFromRouter,
  parseQuery,
  createKeywordsFromApp,
  createQueryString,
} from "@lib/routerAssist";
import { useThemeContext } from "./CustomThemeContext";
import { useRouterContext } from "./RouterContext/RouterContext";

const AppContext = React.createContext();

export function useAppState() {
  return useContext(AppContext);
}
createQueryString;

const initialContext = {
  target: false,
  dueDate: "",
  isLoaded: false,
  keywords: [],
  themeColor: "blue",
  title: "Tracker",
};

export default function ContextProvider({ children }) {
  // const router = useRouter();

  const { router, setRouter } = useRouterContext();
  const { toggleTheme, activeTheme } = useThemeContext();

  const [keywords, setKeywords] = useState([]);
  const [targ, setTarg] = useState(false);
  const [due, setDue] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState("");

  const [article, setArticle] = useState("");
  const [searchValue, setSearchValue] = useState("");
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

  useEffect(() => {
    //Set application state via router from initial load
    let parsed = parseQuery(router.asPath);

    if (
      // open drawer if there are no keywords
      router.isReady &&
      !parsed.kw &&
      !parsed.k0 &&
      !parsed.k1 &&
      !parsed.k2 &&
      !parsed.k3
    ) {
      openDrawer();
    }

    let initialKW = createKeywordsFromRouter(parsed);

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
    let queryObj = reduceToArrays(keywords);

    activeTheme
      ? (queryObj.theme = activeTheme.name)
      : (queryObj.theme = "blue");

    if (due) queryObj.due = due;
    if (targ) queryObj.target = targ;
    if (title) queryObj.title = title;

    // let query = createQueryString(queryObj);
    // router.push(query, undefined, { shallow: true });
    setRouter(queryObj);
  }, [updateRouter]);

  function createNewKeywords(newKeywordsText) {
    let initialKW = createKeywordsFromApp(newKeywordsText);
    updateKeywords(article, initialKW);
  }

  const openDrawer = () => {
    setTimeout(() => {
      document.getElementById("keywordField").focus();
    }, 25);
    setDrawerOpen(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const hotkeysRef = useRef({
    stamp: performance.now(),
    count: 0,
  });

  const focusElement = (num) => {
    const locations = [
      document.getElementById("SearchInput"),
      document.getElementById("article"),
      document.getElementById("tags-filled"),
    ];
    locations[num % locations.length].focus()
  };

  useHotkeys(
    // Alt + / focuses SearchInput, clears input field
    "alt+/",
    () => {
      const currentTime = performance.now();
      const diff = currentTime - hotkeysRef.current.stamp;
      if (diff < 500) {
        hotkeysRef.current = {
          stamp: currentTime,
          count: hotkeysRef.current.count + 1,
        };
      } else {
        hotkeysRef.current = {
          stamp: currentTime,
          count: 0,
        };
      }
      focusElement(hotkeysRef.current.count);
      closeDrawer();
      // focusElement(3);
      setSearchValue("");
    },
    {
      enableOnTags: ["TEXTAREA", "INPUT", "SELECT"],
    }
  );

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
    return `Theme set to ${theme}!`;
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
    disabled,
    setDisabled,
    keywords,
    setKeywords,
    article,
    setArticle,
    searchValue,
    setSearchValue,
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
