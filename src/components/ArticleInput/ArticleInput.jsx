import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";

export default function ArticleInput(props) {
  const { article, setArticle, setDisabled } = props;

  const handleArticleChange = (e) => {
    const newArticleText = cleanString(e.target.value);
    setArticle(newArticleText);
    setDisabled(true);
  };

  const getWordsByWordBoundaries = (str) => {
    //
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

  return (
    <>
      <TextField
        name="article"
        value={article}
        id="article"
        label={`Word Count: ${countWordsInArticle(article)}`}
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
