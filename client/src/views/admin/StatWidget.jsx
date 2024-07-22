import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

const StatWidget = ({ title, value, color }) => (
  <Card variant="outlined">
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" style={{ color }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default StatWidget;
