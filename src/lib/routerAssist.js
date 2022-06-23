import queryString from "query-string";

export function reduceToArrays(keywords) {
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

  return queryObj;
}

export function setRouter(queryObj) {
  // if (!queryObj) return false
  // let query = "/?" + queryString.stringify(queryObj);
  // router.push(query, undefined, { shallow: true });
}

export function createKeywordsFromRouter(queryObj) {
  const output = []
  const names = { kw: 0, k0: 0, k1: 1, k2: 2, k3: 3 };

  for (const kw in names) {
    //if router.query[kw] exists
    if (!!queryObj[kw]) {
      let group = queryObj[kw];
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
        output.push(val);
      });
    }
  }
  return output
}

export function createKeywordsFromApp(keywordsText, sep="\n") {
  let output = [];
  let group = keywordsText
    .replace("\r", "")
    .split(sep)
    .filter((k) => k.length > 0);

  group.map((k) => {
    let val = {
      name: k.toLowerCase().trim(),
      group: 0,
      count: 0,
      hidden: false,
    };
    output.push(val);
  });
  return output
}

export function parseQuery(string){
 return queryString.parse(string.replace("/?", ""));
}

export function createQueryString(queryObj){
  return "/?" + queryString.stringify(queryObj);
}