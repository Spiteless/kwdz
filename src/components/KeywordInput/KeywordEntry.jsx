import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { useAppState } from "@context/AppContext";

export default function KeywordInput({}) {
  const {
    keywords,
    setDisabled,
    disabled,
    createNewKeywords,
    article,
    forceRerender,
    setForceRerender,
    closeDrawer,
  } = useAppState();

  const [wordsText, setWordsText] = useState([]);

  useEffect(() => {
    setWordsText(keywords.map((k) => k.name).join("\n"));
  }, [keywords]);

  const handleChange = (e) => setWordsText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewKeywords(wordsText, article);
    closeDrawer();
    setForceRerender(forceRerender + 1);
  };

  return (
    <Stack>
      <TextField
        fullWidth
        multiline
        name="keywordField"
        id="keywordField"
        variant="outlined"
        rows={14}
        label="Add keywords separated by line break."
        value={wordsText}
        onChange={(e) => handleChange(e)}
        onFocus={() => {
          setDisabled(false);
        }}
        InputProps={{
          sx: { minWidth: 300 },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton edge="end" color="primary" onClick={handleSubmit}>
                <SendIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />
      <Button variant="outlined" onClick={handleSubmit}>
        Submit!
      </Button>
    </Stack>
  );
}
