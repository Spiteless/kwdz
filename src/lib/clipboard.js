export const copyToClipboard = (keywords) => {
  let text = "";
  text = keywords
    .filter((val) => val.count === 0)
    .map((val) => val.name)
    .join("\n");
  text = "%% MISSING WORDS\n" + text + "\n%%";
  navigator.clipboard.writeText(text);
  return "Clipboard Set!";
};
