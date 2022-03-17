import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { TextField } from '@material-ui/core'

export default function ArticleInput(props) {
  const {
    article,
    setArticle,
    setDisabled,
  } = props

  const handleArticleChange = (e) => {
    setArticle(e.target.value)
    setDisabled(true)
  }

  const cleanString = (str) => {
    return str.replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  const extractSubstr = (str, regexp) => {
    return cleanString(str).match(regexp) || [];
  }

  const getWordsByWordBoundaries = (str) => {
    return extractSubstr(str, /\b[a-z\d]+\b/g);
  }

  const countWords = (str) => {
    return getWordsByWordBoundaries(str).length;
  }

  return (
    <>
      <TextField
        name='article'
        value={article}
        id="article"
        label={`Word Count: ${countWords(article)}`}
        placeholder="Paste article text here."
        multiline
        variant="outlined"
        onChange={handleArticleChange}
        onClick={() => setDisabled(true)}
        fullWidth
        rows={25}
      />
    </>
  )
}