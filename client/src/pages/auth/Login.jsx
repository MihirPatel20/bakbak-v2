import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { loginUser } from "@/reducer/auth/auth.thunk";
import {  showSnackbar } from "reducer/snackbar/snackbar.slice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "malvina_miller60@hotmail.com",
      password: "1234",
    },
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginRequest = async (userData) => {
    // dispatch(showSnackbar("success", "success message"));

    try {
      await dispatch(loginUser(userData)).unwrap();
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
      // dispatch(showSnackbar("error", error));
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
      sx={{ background: "linear-gradient(to right, #667eea, #764ba2)" }}
    >
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" textAlign="center" gutterBottom>
              Login
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit(handleLoginRequest)}
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <div>
                <TextField
                  size="small"
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email", { required: "Email is required" })}
                  error={!!errors.email}
                  helperText={errors.email && errors.email.message}
                />
              </div>

              <div>
                <TextField
                  size="small"
                  label="Password"
                  placeholder="********"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  error={!!errors.password}
                  helperText={errors.password && errors.password.message}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
              </div>
              {/* <div>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    dispatch(showSnackbar("success", "success message"));
                  }}
                >
                  Snackbar
                </Button>
              </div> */}
            </Box>
          </CardContent>
        </Card>

        <Typography variant="body2" mt={2}>
          <Link component={RouterLink} to="/forgot-password">
            Forgot Your Password?
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Login;
