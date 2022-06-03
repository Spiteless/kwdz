export default function processKeywords(str, phrases) {
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
