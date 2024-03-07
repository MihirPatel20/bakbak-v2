import React from "react";
import NavBar from "components/global/NavBar";
import { Grid } from "@mui/material";
import ChatHistory from "./ChatHistory.jsx";
import ChatArea from "./ChatArea.jsx";
import UsersList from "./UsersList.jsx";
import { LocalStorage } from "@/utils/LocalStorage.js";

const Home = () => {
  const [activeChat, setActiveChat] = React.useState(
    LocalStorage.get("activeChat") || {}
  );

  return (
    <>
      <NavBar />
      <Grid container spacing={1} p={1}>
        <Grid item sm={3} lg={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <ChatHistory activeChat={activeChat} setActiveChat={setActiveChat} />
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <ChatArea activeChat={activeChat} />
        </Grid>
        <Grid item sm={3} lg={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <UsersList setActiveChat={setActiveChat} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
