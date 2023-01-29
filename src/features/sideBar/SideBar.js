

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { BsPeople } from "react-icons/bs";
import MailIcon from "@mui/icons-material/Mail";
import message from "images/sidebar/Vector-2.svg";
import messages from "images/sidebar/Vector-3.svg";
import companies from "images/sidebar/Vector-1.svg";
import dashboard from "images/sidebar/Vector.svg";
import trips from "images/routing.png";
import rider from "images/profile-2user.png";


import map from "images/sidebar/Vector-5.svg";
import logouts from "images/logout.png";
import LoginHeader from "common/LoginHeader";
import { RouteEnum } from "constants/RouteConstants";
import { useNavigate } from "react-router-dom";
import { ExpandLess, ExpandMore, Logout } from "@mui/icons-material";
import { Collapse } from "@mui/material";

const drawerWidth = 340;

export default function PermanentDrawerLeft() {
  const history = useNavigate();
  const [openInventory, setOpenInventory] = React.useState(false);
  const [openPersonnel, setOpenPersonnel] = React.useState(false);
  const [openReports, setOpenReports] = React.useState(false);
  const [outcasts, setOutcasts] = React.useState([
    { name: "Logout", linx: RouteEnum.HOME, image: logouts },
  ]);

  const [pat, setPat] = React.useState([
    {
      name: "Dashboard",
      d: RouteEnum.DASHBOARD,
      image: dashboard,
      color: true,
    },
    {
      name: "Inventory",
      d: '#',
      // d: RouteEnum.MANAGE_COMPANIES,
      image: companies,
      color: false,
    },

    {
      name: "Personnel Manager",
      d: "#",
      image: companies,
      color: false,
    },

    {
      name: "Prescriptions",
      d: RouteEnum.PRESCRIPTION,
      image: message,
      color: false,
    },
    {
      name: "Dispensary",
      d: RouteEnum.DISPENSARY,
      image: messages,
      color: false,
    },
    // {
    //   name: "Reports",
    //   d: RouteEnum.MANAGE_RIDERS,
    //   image: rider,
    //   color: false,
    // },
    // { name: "Configuration", d: "#", image: trips, color: false },
    // { name: "Contact Management", d: "#", image: map, color: false },
    // {name:'Reviews', d:RouteEnum.MANAGE_COMPANIES},
    // { name: "Notifications", d: "#", image: message, color: false },
    // { name: "Chat with Visitors", d: "#", image: messages },
    // {
    //   name: "Application Settings",
    //   d: "#",
    //   image: map,
    //   color: false,
    // },
    // // {name:'Reviews', d:RouteEnum.MANAGE_COMPANIES},
    // { name: "Covid 19", d: "#", image: message, color: false },
    // { name: "Get Technical Help", d: "#", image: messages },
    // {name:'Support', d:RouteEnum.SUPPORT}
  ]);
 

  const [inventoryCollapse, setInventoryCollapse] = React.useState([
    {
      name: "List Of Medicines",
      d: RouteEnum.LIST_OF_MEDICINES,
      image: companies,
      color: true,
    },
    {
      name: "Medicine Groups",
      d: RouteEnum.MEDICINE_GROUPS,
      image: companies,
      color: false,
    },
  ]);

  const [reportCollapse, setReportCollapse] = React.useState([
    {
      name: "Sales Report",
      d: RouteEnum.LIST_OF_MEDICINES,
      image: companies,
      color: true,
    },
    {
      name: "Payment Report",
      d: RouteEnum.MEDICINE_GROUPS,
      image: companies,
      color: false,
    },
  ]);


  const [personelCollapse, setPersonelCollapse] = React.useState([
    {
      name: "Dispensers",
      d: RouteEnum.DISPENSER,
      image: companies,
      color: true,
    },
    {
      name: "patients",
      d: RouteEnum.PATIENT,
      image: companies,
      color: false,
    },
    {
      name: "Prescribers",
      d: RouteEnum.PRESCRIBER,
      image: companies,
      color: false,
    },
  ]);
  const redirect = (push) => {
    console.log(push);
    history(push);
    // logout()
  };

  const handleOpenInventory = (index) => {
    index === 1
      ? setOpenInventory((prev) => !prev)
      : index === 2
      ? setOpenPersonnel((prev) => !prev)
      : console.log();
  };

  const handleOpenReports = () => {
    setOpenReports((prev) => !prev);
  };

  const logout = (push) => {
    localStorage.removeItem("il");
    console.log("hi");
    history(push);
  };

  // const pat =

  const changeColorOnActive = (num) => {
    let k = pat.map((e, index) => ({
      name: e.name,
      d: e.d,
      image: e.image,
      color: num == index ? true : false,
    }));
    setPat(k);
  };

  const changeInventoryColorOnActive = (num) => {
    let k = inventoryCollapse.map((e, index) => ({
      name: e.name,
      d: e.d,
      image: e.image,
      color: num == index ? true : false,
    }));

    setInventoryCollapse(k);
  };

  const changeReportColorOnActive = (num) => {
    let k = inventoryCollapse.map((e, index) => ({
      name: e.name,
      d: e.d,
      image: e.image,
      color: num == index ? true : false,
    }));

    setInventoryCollapse(k);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#1E1E1E" }}>
      {/* <CssBaseline /> */}
      {/* <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Drawer
        sx={{
          width: drawerWidth,
          backgroundColor: "#283342",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#283342",
            color: "white",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        {/* <Toolbar /> */}
        <div className="px-3 py-5 bg-[#1D242E]">
          <LoginHeader />
        </div>
        {/* <Divider /> */}
        <List>
          {pat.map((text, index) => (
            <>
              <ListItem
                style={{
                  backgroundColor: text.color ? "#009099" : "",
                  color: text.color ? "white" : "",
                  fontSize: "x-large",
                }}
                // inkBarStyle={{ background: "yellow" }}
                key={text.name}
                disablePadding
              >
                <ListItemButton
                  onClick={() => {
                    redirect(text.d);
                    changeColorOnActive(index);
                    handleOpenInventory(index);
                  }}
                >
                  <ListItemIcon>
                    {index === 2 ? (
                      <BsPeople fontSize={24} />
                    ) : (
                      <img src={text.image} />
                    )}
                  </ListItemIcon>
                  <ListItemText fontSize={"x-large"} primary={text.name} />
                </ListItemButton>
                {index === 1 &&
                  (openInventory ? <ExpandLess /> : <ExpandMore />)}
                {index === 2 &&
                  (openInventory ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>
              {index === 1 &&
                inventoryCollapse.map((text, index) => (
                  <Collapse
                    in={openInventory}
                    timeout="auto"
                    unmountOnExit
                    sx={{ backgroundColor: "#1D242E" }}
                  >
                    <List component="div" disablePadding>
                      <ListItemButton
                        onClick={(e) => {
                          e.stopPropagation();
                          redirect(text.d);
                          changeInventoryColorOnActive(index);
                        }}
                      >
                        <ListItemIcon>
                          <img src={text.image} />
                        </ListItemIcon>
                        <ListItemText primary={text.name} />
                      </ListItemButton>
                    </List>
                  </Collapse>
                ))}
              {/* {index === 2 &&
                reportCollapse.map((text, index) => (
                  <Collapse
                    in={openReports}
                    timeout="auto"
                    unmountOnExit
                    sx={{ backgroundColor: "#EBEBEB" }}
                  >
                    <List component="div" disablePadding>
                      <ListItemButton
                        onClick={(e) => {
                          e.stopPropagation();
                          redirect(text.d);
                          changeReportColorOnActive(index);
                        }}
                      >
                        <ListItemIcon>
                          <img src={text.image} />
                        </ListItemIcon>
                        <ListItemText primary={text.name} />
                      </ListItemButton>
                    </List>
                  </Collapse>
                ))} */}

              {index === 2 &&
                personelCollapse.map((text, index) => (
                  <Collapse
                    in={openPersonnel}
                    timeout="auto"
                    unmountOnExit
                    sx={{ backgroundColor: "#1D242E" }}
                  >
                    <List component="div" disablePadding>
                      <ListItemButton
                        onClick={(e) => {
                          e.stopPropagation();
                          redirect(text.d);
                          changeReportColorOnActive(index);
                        }}
                      >
                        <ListItemIcon>
                          <img src={text.image} />
                        </ListItemIcon>
                        <ListItemText primary={text.name} />
                      </ListItemButton>
                    </List>
                  </Collapse>
                ))}
            </>
          ))}
        </List>
        <Divider />
        <List>
          {outcasts.map((text, index) => (
            <ListItem
              className={index % 2 == 0 ? "mt-36" : ""}
              key={text.name}
              disablePadding
            >
              <ListItemButton onClick={() => logout(text.linx)}>
                <ListItemIcon>
                  <img src={text.image} />
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                </ListItemIcon>
                <ListItemText
                  sx={{ fontSize: "x-large" }}
                  primary={text.name}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}

