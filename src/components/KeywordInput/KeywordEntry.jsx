import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  TextField,
  Button,
  ButtonGroup,
  FormControl,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";

import { useAppState } from "@context/AppContext";
import { Box } from "@mui/system";
import { SearchOutlined } from "@material-ui/icons";
import SendIcon from "@mui/icons-material/Send";
import { SendAndArchiveOutlined } from "@mui/icons-material";

export default function KeywordInput(props) {
  const appState = useAppState();
  const {
    context,
    setContext,
    keywords,
    setKeywords,
    setRouter,
    setDisabled,
    disabled,
    initializeNewKeywords,
    article,
    forceRerender,
    setForceRerender,
    toggleDrawer,
    keywordEntryRef,
  } = useAppState();

  const [wordsText, setWordsText] = useState([]);

  useEffect(() => {
    setWordsText(keywords.map((k) => k.name).join("\n"));
  }, [keywords]);

  const handleChange = (e) => setWordsText(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    initializeNewKeywords(wordsText, article);
    toggleDrawer(false);
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
        label={"Close sidebar to submit."}
        // color="secondary"
        keywordEntryRef={keywordEntryRef}
        value={
          disabled
            ? // ? keywordsProcessed.map((item) => `${item[1]} ${item[0]}`).join("\n")
              wordsText
            : // : keywords.text
              wordsText
        }
        onChange={(e) => handleChange(e)}
        onFocus={() => {
          setDisabled(false);
        }}
        // onBlur={(e) => {
        //   handleSubmit(e);
        //   setDisabled(true);
        // }}
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
      <Button variant="outlined">Submit!</Button>
    </Stack>
  );
}
