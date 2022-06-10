function processKeywords(article, phrases, props) {
  phrases.map(phrase => {
    if (props) phrase.hidden = props.hidden
    let occ = occurrences(article, phrase.name)
    phrase.count = occ
    phrase.color = getColor(phrase)

  })
  //sort by name first
  phrases.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
  //sort by number of occurances
  phrases.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
  //sort by grouping
  phrases.sort((a, b) => {
    if (a.count < b.count) return -1
    if (a.count > b.count) return 1
    return 0
  })
  return phrases
}

export function getColor(phrase) {
  const colors = {
    "n": "success",
    "0": "default",
    "1": "secondary",
    "2": "info",
    "3": "warning",
  }
  return (phrase.count > 0) ? colors.n : colors[phrase.group]
}

function occurrences(string, subString, allowOverlapping = false) {

  string += "";
  subString += "";

  if (subString.length <= 0) return (string.length + 1);

  let n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }

  return n;
}


const countWords = (str) => {
  return getWordsByWordBoundaries(str).length;
};

const getWordsByWordBoundaries = (str) => {
  return extractSubstr(str, /\b[a-z\d]+\b/g);
};

const extractSubstr = (str, regexp) => {
  return clean(str).match(regexp) || [];
};

const clean = (str) => {

  return (str
    .replace(/%%(.|\n)*%%/gm, "")
    //select everything between double-percent signs and remove it
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ") //replace whitespace characters with ' '
    .replace(/-|'/gm, " ") //remove dashes and apostrophes
    .toLowerCase()
  );
};

module.exports = {
  processKeywords,
  getColor,
  clean,
  countWords,
  getWordsByWordBoundaries,
  extractSubstr
}