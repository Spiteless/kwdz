import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Button from "@mui/material/Button";
import { TextField } from "@material-ui/core";

function EdgePanel({ toggleDrawer, mobileOpen, window }) {
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toolbar />
      <Divider />
      <List
        sx={{
          flexGrow: 1,
          minWidth: 300
        }}
        
      >
        <ListItem>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            // selected="subMessage"
            placeholder="enter keywords seperated by linebreak"
            helperText="Text below main message."
            label="enter keywords seperated by linebreak"
            ariaLabel="Choose countdown submessage"
            rows={8}
            // sx={{width: 300}}
            // inputProps={{ width: 500 }}
          />
        </ListItem>
      </List>
      <List>
        <ListItem
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <DeleteForeverIcon />
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        component="nav"
        // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Application controls"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              // width: drawerWidth,
            },
          }}
          PaperProps={{ border: "2px orange solid" }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default EdgePanel;
