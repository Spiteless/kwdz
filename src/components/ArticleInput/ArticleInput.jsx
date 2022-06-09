import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";
import { useAppState } from "@context/AppContext";

export default function ArticleInput(props) {
  const {
    context,
    setContext,
    setKeywords,
    updateKeywords,
    setDisabled,
    article,
    keywords,
    setArticle,
  } = useAppState();

  const handleArticleChange = (e) => {
    const newArticleText = cleanString(e.target.value);
    const newContext = { ...context };
    newContext.article = newArticleText;
    updateKeywords(newArticleText, keywords);
    setArticle(newArticleText);
    setContext(newContext);
    setDisabled(true);
  };

  const getWordsByWordBoundaries = (str) => {
    return extractSubstr(str, /\b[a-z\d]+\b/g);
  };

  const extractSubstr = (str, regexp) => {
    return cleanString(str).match(regexp) || [];
  };

  const cleanString = (str) => {
    return (
      str
        .replace(/%%(.|\n)*%%/gm, "")
        //select everything between double-percent signs and remove it
        .replace(/[^\w\s]|_/g, "")
        .replace(/\s+/g, " ") //replace whitespace characters with ' '
        .replace(/-|'/gm, " ") //remove dashes and apostrophes
        .toLowerCase()
    );
  };

  const countWordsInArticle = (str) => {
    return getWordsByWordBoundaries(str).length;
  };

  let textLabel = `Word Count: ${countWordsInArticle(article)}`;
  if (context.target) {
    textLabel += `/${context.target}`;
  }
  if (context.dueDate) {
    textLabel += ` -- due ${context.dueDate}`;
  }

  return (
    <TextField
      sx={{}}
      inputProps={{}}
      name="article"
      value={article}
      id="article"
      label={textLabel}
      placeholder="Paste article text here."
      multiline
      variant="outlined"
      onChange={handleArticleChange}
      onClick={() => setDisabled(true)}
      fullWidth
      rows={2}
    />
  );
}
