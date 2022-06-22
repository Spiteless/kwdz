import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Toolbar from "@mui/material/Toolbar";
import { useAppState } from "@context/AppContext";
import { Button } from "@mui/material"

import KeywordEntry from "@components/KeywordInput/KeywordEntry";
import { useThemeContext } from "@context/CustomThemeContext";

function EdgePanel({ window }) {
  const { toggleDrawer, drawerOpen, toggleTheme } = useAppState();

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar sx={{display: 'flex', justifyContent: 'center',}}>
        <Button variant="outlined" color="primary" onClick={() => toggleTheme()}>Toggle Theme</Button>
      </Toolbar>
      <Divider />
      <List
        sx={{
          flexGrow: 1,
          minWidth: 300,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ListItem>
          <KeywordEntry />
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="nav" aria-label="Application controls">
        <SwipeableDrawer
          container={container}
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </SwipeableDrawer>
      </Box>
    </Box>
  );
}

export default EdgePanel;
