import React, { useContext } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";

const RouterContext = React.createContext();

export function useRouterContext() {
  return useContext(RouterContext);
}

export default function RouterContextComponent({ children }) {
  const router = useRouter();

  function setRouter(queryObj) {
    if (!queryObj) return false;
    let query = "/?" + queryString.stringify(queryObj);
    router.push(query, undefined, { shallow: true });
  }

  const exports = {
    router: {
      isReady: router.isReady,
      asPath: router.asPath,
    },
    setRouter,
  };

  return (
    <RouterContext.Provider value={exports}>{children}</RouterContext.Provider>
  );
}
