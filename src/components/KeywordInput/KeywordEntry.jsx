import { useState } from "react";
import {
  TextField,
  Button,
  ButtonGroup,
  Box,
  Typography,
  Stack,
  Popper,
} from "@mui/material";

// import {
//   LooksOneIcon,
//   LooksTwoIcon,
//   Looks3Icon,
//   Looks4Icon,
// } from '@mui/icons-material';

import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import Looks4Icon from "@mui/icons-material/Looks4";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useAppState } from "@context/AppContext";

const icon1 = <LooksOneIcon fontSize="small" />;
const icon2 = <LooksTwoIcon fontSize="small" />;
const icon3 = <Looks3Icon fontSize="small" />;
const icon4 = <Looks4Icon fontSize="small" />;

const looksIcons = {
  0: <LooksOneIcon fontSize="small" />,
  1: <LooksTwoIcon fontSize="small" />,
  2: <Looks3Icon fontSize="small" />,
  3: <Looks4Icon fontSize="small" />,
};

const visibilityIcon = <VisibilityOffIcon fontSize="small" />;
const xIcon = <ClearRoundedIcon fontSize="small" />;
// const checkedIcon = <VisibilityIcon fontSize="small" />;

export default function KeywordInput() {
  const appState = useAppState();
  const {
    context,
    setContext,
    keywords,
    setKeywords,
    setDisabled,
    disabled,
    getColor,
  } = useAppState();

  // const [value, setValue] = useState(keywords);
  // const [inputValue, setInputValue] = useState("");
  // const [capture, setCapture] = useState({});

  // const handleChange = () => {
  //   setValue(keywords.filter(phrase => phrase.count === 0));
  // };
  const handleClickRenderOptions = (e, v, d, a) => {
    console.log(e, v, d, a);
  };

  const handleDelete = (chipToDelete) => {
    console.log(chipToDelete);
  };

  const changeHidden = (e, index) => {
    const newKeywords = [...keywords];
    // console.log(e, index, newKeywords[index]);
    newKeywords[index].hidden = !newKeywords[index].hidden;
    // newKeywords[index].color = getColor(option);
    setKeywords(newKeywords);
  };

  const changeGroup = (e, index) => {
    const newKeywords = [...keywords];
    newKeywords[index].group = (newKeywords[index].group + 1) % 4;
    newKeywords[index].color = getColor(newKeywords[index]);
    setKeywords(newKeywords);
  };

  const deleteEntry = (e, index) => {
    const newKeywords = [...keywords];

    if (index > -1) {
      newKeywords.splice(index, 1);
    } else {
      return;
    }
    setKeywords(newKeywords);
  };

  if (!context.isLoaded) return <></>;
  return (
    <>
      <Autocomplete
        multiple
        disableCloseOnSelect
        freeSolo
        id="tags-filled"
        options={keywords}
        getOptionLabel={(option) => option.name}
        value={keywords}
        // PopperComponent={<Popper />}
        renderOption={(props, option, { selected }) => (
          <li
            {...props}
            key={option.name}
            sx={{ display: "inline-flex", flexDirection: "column" }}
          >
            <Checkbox
              icon={xIcon}
              checkedIcon={xIcon}
              style={{ marginRight: -4 }}
              onClick={(e) => deleteEntry(e, props["data-option-index"])}
              // checked={true}
            />
            <Checkbox
              icon={looksIcons[option.group]}
              checkedIcon={looksIcons[option.group]}
              onClick={(e) =>
                changeGroup(e, props["data-option-index"], option)
              }
              color={option.color}
              style={{ marginRight: -4 }}
              checked={true}
            />
            <Checkbox
              icon={visibilityIcon}
              checkedIcon={visibilityIcon}
              onClick={(e) => changeHidden(e, props["data-option-index"])}
              // onDelete={(e) => changeHidden(e, index)}
              style={{ marginRight: 16 }}
              checked={option.hidden}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ minWidth: 300 }}
            >
              <Typography>{option.name}</Typography>
              {/* {console.log(props)} */}
            </Stack>
          </li>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              label={
                option.count > 0
                  ? `${option.name}: ${option.count}`
                  : option.name
              }
              {...getTagProps({ index })}
              color={option.count > 0 ? "success" : option.color}
              onClick={(e) => {
                changeGroup(e, index, option);
              }}
              onDelete={(e) => changeHidden(e, index)}
              deleteIcon={visibilityIcon}
              sx={{ display: option.hidden ? "none" : "flex" }}
            >
              {/* {console.log(option, index, tagValue)} */}
            </Chip>
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={`${keywords.filter((k) => k.count > 0).length}/${
              keywords.length
            } used`}
          />
        )}
      />
      <pre>{JSON.stringify(keywords, undefined, 1)}</pre>
      {/* <pre>{JSON.stringify(inputValue)}</pre> */}
    </>
  );
}

// TODO
// Chips: OnClick set to alternate color
// Chips: Add animation for color change
// Chips: []