import { useState, useCallback, useRef } from "react";
import { debounce } from "@mui/material";
import { TextField, InputAdornment } from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
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
    //
  } = useAppState();

  const [loading, setLoading] = useState(false);
  const [localArticle, setLocalArticle] = useState("");

  const doneLoading = () => setLoading(false);
  const isLoading = () => setLoading(true);

  const submitArticle = (text) => {
    setArticle(text);
    setDisabled(true);
    setWordCount(countWords(text))
    doneLoading();
  };


  const debouncedCallback = useCallback(debounce(text => submitArticle(text), 350), []);

  const handleArticleChange = (e) => {
    const newArticleText = clean(e.target.value);
    isLoading();
    setLocalArticle(newArticleText);
    debouncedCallback(newArticleText);
  };

  let textLabel = `Word Count: ${wordCount}`;
  if (context.target) {
    textLabel += `/${context.target}`;
  }
  if (context.dueDate) {
    textLabel += ` -- due ${context.dueDate}`;
  }

  return (
    <TextField
      sx={{}}
      InputProps={{
        // sx: { minWidth: 300 },
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
