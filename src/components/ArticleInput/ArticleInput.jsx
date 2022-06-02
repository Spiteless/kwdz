import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppState } from "@context/AppContext";
import { TextField } from "@mui/material";

export default function ArticleInput(props) {
  const {
    // article,
    // setArticle,
    // setDisabled
  } = props;
  const {
    context,
    setContext,
    keywords,
    setKeywords,
    keywordsProcessed,
    setKeywordsProcessed,
    setRouter,
    setDisabled,
    article, setArticle
  } = useAppState();
  const appState = useAppState();

  const handleArticleChange = (e) => {
    const newArticleText = cleanString(e.target.value);
    const newContext = { ...context };
    newContext.article = newArticleText;
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
    <>

      <TextField
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
        rows={25}
      />
    </>
  );
}
