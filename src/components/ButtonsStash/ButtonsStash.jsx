import React from 'react'
import { Button, ButtonGroup } from '@mui/material';

export default ButtonsStash() {
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