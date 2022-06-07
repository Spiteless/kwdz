import React from "react";
import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Autocomplete from "@mui/material/Autocomplete";

import { useAppState } from "@context/AppContext";

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
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function Search() {
  const { searchFuncs, totalRenders } = useAppState();
  const { split, functionNames } = searchFuncs;

  const test = Object.keys(functionNames);
  const menuFunctions = Object.keys(functionNames).map((n) => {
    return { label: n + ": " };
  });

  useHotkeys(
    // Alt + / focuses SearchInput, sets input to ""
    "alt+/",
    () => {
      document.getElementById("SearchInput").focus();
      setInputValue("");
    },
    {
      enableOnTags: ["TEXTAREA", "INPUT", "SELECT"],
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputValue("");
  };

  const handleAutocompleteSubmit = (e) => {
    e.preventDefault();
    const [func, argument] = split(inputValue);
    functionNames[func](argument);
    setInputValue("");
  };

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e, value) => {
    setInputValue(value);
  };

  return (
    <>
      <Autocomplete
        freeSolo
        clearOnEscape
        autoHighlight
        id="combo-search-field"
        options={menuFunctions}
        sx={{ width: 300 }}
        onSubmit={(e) => handleAutocompleteSubmit(e)}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        renderInput={(params) => (
          <SearchField ref={params.InputProps.ref} label="Search Menus">
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
      {/* <p>{totalRenders}</p> */}
    </>
  );
}
