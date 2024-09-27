import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "api";
import AvatarUpload from "./AvatarUpload";

// EditProfile Component
const EditProfile = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Local state to handle loading
  const [loading, setLoading] = useState(true);

  // Fetch data from the API when the component mounts
  const fetchProfileData = async () => {
    try {
      const response = await api.get("/profile"); // Replace with your API endpoint
      console.log("Profile data:", response.data.data);
      return response.data.data; // Assuming response.data contains the user data
    } catch (error) {
      console.error("Failed to fetch profile data", error);
      setLoading(false);
      return null;
    }
  };

  const initialValues = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "",
    bio: "",
    dob: "",
    location: "",
    submit: null,
  };

  return (
    <Container sx={{ px: 2, mt: { sm: 0, md: 3 } }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" align="center" gutterBottom>
          Edit Profile
        </Typography>
        <Typography
          variant="subtitle2"
          align="center"
          color="textSecondary"
          sx={{ mb: 3 }}
        >
          Update your personal information
        </Typography>

       
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              console.log("Profile updated: ", values);

              await api.patch("/profile", values); // Replace with your PATCH API

              navigate("/profile");
              setStatus({ success: true });
              setSubmitting(false);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setValues, // Access the Formik setValues function
          }) => {
            // Use useEffect to set form values after fetching profile data
            useEffect(() => {
              const loadProfile = async () => {
                const profile = await fetchProfileData();
                if (profile) {
                  setValues({
                    firstName: profile.firstName || "",
                    lastName: profile.lastName || "",
                    phoneNumber: profile.phoneNumber || "",
                    countryCode: profile.countryCode || "",
                    bio: profile.bio || "",
                    dob: profile.dob || "",
                    location: profile.location || "",
                  });
                }
                setLoading(false);
              };

              loadProfile();
            }, [setValues]);

            if (loading) {
              return <Typography>Loading...</Typography>; // Loading state
            }

            return (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="First Name"
                      value={values.firstName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.firstName && errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Last Name"
                      value={values.lastName}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.lastName && errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="bio"
                      name="bio"
                      label="Bio"
                      multiline
                      rows={4}
                      value={values.bio}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.bio && errors.bio)}
                      helperText={touched.bio && errors.bio}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="phoneNumber"
                      name="phoneNumber"
                      label="Phone Number"
                      value={values.phoneNumber}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="dob"
                      name="dob"
                      label="Date of Birth"
                      type="date"
                      value={values.dob}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={Boolean(touched.dob && errors.dob)}
                      helperText={touched.dob && errors.dob}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="location"
                      name="location"
                      label="Location"
                      value={values.location}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.location && errors.location)}
                      helperText={touched.location && errors.location}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="countryCode"
                      name="countryCode"
                      label="Country Code"
                      value={values.countryCode}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.countryCode && errors.countryCode)}
                      helperText={touched.countryCode && errors.countryCode}
                    />
                  </Grid>
                </Grid>

                {errors.submit && (
                  <Box sx={{ mt: 3 }}>
                    <Typography color="error" variant="body2">
                      {errors.submit}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disableElevation
                    disabled={isSubmitting}
                    sx={{ width: "50%", py: 1.5, borderRadius: "20px" }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </Paper>
    </Container>
  );
};

export default EditProfile;
