import React from "react";
import ActivityFeed from "./ActivityFeed";
import ActiveUsers from "./ActiveUsers";
import withDualPaneLayout from "layout/DualPaneLayout";

const Home = withDualPaneLayout(ActivityFeed, ActiveUsers);

export default Home;
