import React from "react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Box from "@mui/material/Box";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import InputAdornment from "@mui/material/InputAdornment";

import { useAppState } from "@context/AppContext";

// ~
// ~    next step is to do somethig like
// ~    "set target: "
// ~
// ~    as a label so that I can setTarget: 1000
// ~    and then have app run that function
// ~

const SearchField = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Search() {
  const { searchFuncs } = useAppState();
  const { split, functionNames, setTarget } = searchFuncs;
  console.log(searchFuncs, split);

  const [searchValue, setSearchValue] = useState("");

  const test = Object.keys(functionNames);
  const menuFunctions = test.map((n) => ({ label: n + ": " }));
  // const menuFunctions = [{ label: "setTarget: " }];
  // const menuFunctions = [Object.keys(functionNames).map( str => {label: str})];
  // console.log(Object.keys(functionNames))
  // console.log(result[0], typeof result[0])

  useHotkeys(
    "alt+/",
    () => {
      document.getElementById("SearchInput").focus();
      setInputValue("");
    },
    {
      enableOnTags: ["TEXTAREA", "INPUT", "SELECT"],
    }
  );

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleAutocompleteSubmit = (e) => {
    e.preventDefault();
    const [func, argument] = split(inputValue);
    functionNames[func](argument);
  };

  const [value, setValue] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Autocomplete
      freeSolo
      clearOnEscape
      clearOnBlur
      id="combo-box-demo"
      options={menuFunctions}
      sx={{ width: 300 }}
      onSubmit={handleAutocompleteSubmit}
      onChange={(event, newValue) => {
        console.log("onChange", event, newValue);
        setValue(newValue);
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        console.log("onInputChange", event, newInputValue);
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <SearchField ref={params.InputProps.ref} label="Movie">
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search menus (Alt + /)"
            inputProps={{
              "aria-label": "search",
              ...params.inputProps,
              id: "SearchInput",
              onSubmit: (e) => handleSubmit(e),
            }}
          />
        </SearchField>
      )}
    />
  );
}
