export default function processKeywords(article, phrases) {
  const output = [];
  phrases.map(phrase => {
    const sub = {}
    sub.count = occurrences(article, phrase)
    sub.name = phrase.toLowerCase()
    output.push(sub)
  })
  output.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })
  output.sort((a, b) => {
    if (a.count < b.count) return -1
    if (a.count > b.count) return 1
    return 0
  })

  return output
}

function processKeywordsBACKUP(str, phrases) {
  const output = [];
  phrases.map((key) => {
    output.push([key, occurrences(str.toLowerCase(), key.toLowerCase())]);
  });
  output.sort((a, b) => {
    if (a[0].toLowerCase() < b[0].toLowerCase()) return -1;
    if (a[0].toLowerCase() > b[0].toLowerCase()) return 1;
    return 0; ``
  });
  output.sort((a, b) => {
    return a[1] - b[1];
  });
  console.log(output)
  return output;
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
