import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "api";

const AdminPanel = () => {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Fetch users and stats when the component mounts
    api.get("admin/users").then((res) => setUsers(res.data.data));
    api.get("admin/stats").then((res) => setStats(res.data.data));
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      await api.delete("admin/chats");
      console.log("Chats collection dropped");
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
  };

  const handleSeedSocialMedia = async () => {
    try {
      await api.post("/seed/social-media");
      console.log("Social media seeded successfully");
      // Optionally, you can fetch updated statistics or users after seeding
      // Example:
      // await api.get("admin/users").then((res) => setUsers(res.data.data));
      // await api.get("admin/stats").then((res) => setStats(res.data.data));
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "role", headerName: "Role", width: 150 },
  ];

  const getRowId = (row) => row._id; // Specify _id as the unique identifier

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography
          variant="body1"
          fontSize={16}
          fontWeight={600}
          component="div"
        >
          Total Users: {stats.totalUsers}
        </Typography>
        <Typography
          variant="body1"
          fontSize={16}
          fontWeight={600}
          component="div"
        >
          Total Chats: {stats.totalChats}
        </Typography>
      </Box>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={getRowId}
        />
      </div>

      <Button variant="contained" color="secondary" onClick={handleClickOpen}>
        Drop Chats Collection
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSeedSocialMedia}
      >
        Seed Social Media
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all chat data? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
