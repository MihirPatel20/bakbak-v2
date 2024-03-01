import React from "react";
import NavBar from "components/global/NavBar";
import { Grid } from "@mui/material";
import ChatHistory from "./ChatHistory.jsx";
import ChatArea from "./ChatArea.jsx";
import UsersList from "./UsersList.jsx";

const Home = () => {
  return (
    <>
      <NavBar />
      <Grid container>
        <Grid item sm={3} lg={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <ChatHistory />
        </Grid>
        <Grid item xs={12} sm={6} lg={6}>
          <ChatArea />
        </Grid>
        <Grid item sm={3} lg={3} sx={{ display: { xs: "none", sm: "block" } }}>
          <UsersList />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
