import { useState } from "react";
import { TextField, Button, ButtonGroup } from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { useAppState } from "@context/AppContext";

export default function KeywordInput(props) {
  const appState = useAppState();
  const {
    context,
    setContext,
    keywords,
    setKeywords,
    keywordsProcessed,
    setKeywordsProcessed,
    setRouter,
    setDisabled,
    disabled,
  } = useAppState();

  const handleKeywordsChange = (e) => {
    const newState = { ...keywords };
    newState.text = e.target.value;
    newState.phrases = e.target.value.replace("\r", "").split("\n");
    setKeywords(newState);

    const newAppState = { ...appState.context };
    newAppState.keywords = [...newState.phrases];
    setRouter(newAppState);
  };

  return (
    <>
      <Tags />
      {/* <Buttons /> */}
    </>
  );
}

const Buttons = () => {
  const appState = useAppState();
  const { searchFuncs } = appState;
  const { copyToClipboard } =
    searchFuncs.functionNames["copyMissingToClipboard()"];

  return (
    <ButtonGroup
      fullWidth
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        whiteSpace: "nowrap",
      }}
    >
      <Button
        style={{ marginTop: 5, minWidth: 140 }}
        variant="outlined"
        color="primary"
        onClick={copyToClipboard}
      >
        Copy All
      </Button>
      <Button
        style={{ marginTop: 5, minWidth: 140 }}
        variant="outlined"
        color="primary"
        onClick={copyToClipboard}
      >
        Copy Missing
      </Button>
    </ButtonGroup>
  );
};

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Tags = () => {
  const appState = useAppState();
  const {
    context,
    setContext,
    keywords,
    setKeywords,
    keywordsProcessed,
    setKeywordsProcessed,
    setRouter,
    setDisabled,
    disabled,
  } = useAppState();

  const [value, setValue] = useState(keywordsProcessed);
  const [inputValue, setInputValue] = useState("");

  // const handleChange = () => {
  //   setValue(keywordsProcessed.filter(phrase => phrase.count === 0));
  // };

  return (
    <Autocomplete
      multiple
      id="tags-filled"
      options={keywordsProcessed}
      getOptionLabel={(option) => option.name}
      value={keywordsProcessed}
      renderOption={(props, option, { selected }) => (
        <li {...props} key={option.name}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={option.count > 0}
          />
          {props.key}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={
              option.count > 0 ? `${option.name}: ${option.count}` : option.name
            }
            {...getTagProps({ index })}
            color={option.count > 0 ? "success" : "default"}
          />
        ))
      }
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={`${keywordsProcessed.filter((k) => k.count > 0).length}/${
            keywordsProcessed.length
          } used`}
        />
      )}
    />
  );
};
