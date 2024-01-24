import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  TextField,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  resetForgottenPassword,
  updateUserAvatar,
  resendEmailVerification,
} from "reducer/auth/auth.thunk";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "mihirpatel",
    email: "mihirpatel2082001@gmail.com",
    password: "mihir",
    emailVerificationToken: "",
    resetPassToken: "",
    newPassword: "",
    avatar: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "avatar" && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const dispatch = useDispatch();

  const dispatchThunk = async (thunk, data = null, callback) => {
    try {
      const res = await dispatch(thunk(data)).unwrap();
      console.log("res: ", res);
      if (callback) {
        callback(res);
      }
    } catch (error) {
      // console.log("error: ", error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h4" gutterBottom>
          User Authentication
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(registerUser, formData)}
            >
              Register
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(loginUser, formData)}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(logoutUser)}
            >
              Logout
            </Button>
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(refreshAccessToken)}
            >
              Refresh Token
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom>
          Additional Actions
        </Typography>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={6} lg={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(resendEmailVerification)}
            >
              Resend Email Verification
            </Button>
          </Grid>
          <Grid item xs={6} lg={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(forgotPassword, formData.email)}
            >
              Forgot Password
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              fullWidth
              label="Email Verification Token"
              name="emailVerificationToken"
              value={formData.emailVerificationToken}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(verifyEmail)}
            >
              Verify Email
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} style={{ marginTop: 20 }}>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              fullWidth
              label="Reset Token"
              name="resetPassToken"
              value={formData.resetPassToken}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              fullWidth
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(resetForgottenPassword, formData)}
            >
              Reset Password
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <label>
              Avatar:
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleInputChange}
              />
            </label>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => dispatchThunk(updateUserAvatar, formData.avatar)}
            >
              Update Avatar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
