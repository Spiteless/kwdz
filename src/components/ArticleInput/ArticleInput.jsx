import { useState, useCallback, useEffect } from "react";
import { debounce } from "@mui/material";
import { TextField, InputAdornment } from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";

import { useAppState } from "@context/AppContext";
import { clean, countWords } from "@lib/processKeywords";

export default function ArticleInput(props) {
  const {
    context,
    setDisabled,
    article,
    setArticle,
    wordCount,
    setWordCount,
    targ: target,
    due: dueDate,
    //
  } = useAppState();

  const [loading, setLoading] = useState(false);
  const [localArticle, setLocalArticle] = useState("");

  useEffect(() => {
    if (article !== localArticle) setLocalArticle(article);
  }, [article]);

  const submitArticle = (text) => {
    setArticle(text);
    setDisabled(true);
    setWordCount(countWords(text));
    setLoading(false);
  };

  const debouncedCallback = useCallback(
    debounce((text) => submitArticle(text), 350),
    []
  );

  const handleArticleChange = (e) => {
    const newArticleText = clean(e.target.value);
    setLoading(true);
    setLocalArticle(newArticleText);
    debouncedCallback(newArticleText);
  };

  let textLabel = `Word Count: ${wordCount}`;
  if (target) {
    textLabel += `/${target}`;
  }
  if (dueDate) {
    textLabel += ` -- due ${dueDate}`;
  }

  return (
    <TextField
      sx={{}}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <CheckIcon size="large" color="success" />
            )}
          </InputAdornment>
        ),
      }}
      name="article"
      value={localArticle}
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
