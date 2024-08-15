import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Avatar,
  Box,
  ButtonBase,
  Card,
  Grid,
  InputAdornment,
  OutlinedInput,
  Popper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListSubheader,
} from "@mui/material";

// third-party
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";

// project imports
import Transitions from "ui-component/extended/Transitions";

// assets
import {
  IconAdjustmentsHorizontal,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { shouldForwardProp } from "@mui/system";
import useDebounce from "hooks/useDebounce";
import api from "api";
import { useNavigate } from "react-router-dom";

// styles
const PopperStyle = styled(Popper, { shouldForwardProp })(({ theme }) => ({
  zIndex: 1100,
  width: "99%",
  // top: "0px !important", // Adjusted for proper positioning
  padding: "0 12px",
  [theme.breakpoints.down("sm")]: {
    padding: "0 10px",
  },
}));

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(
  ({ theme }) => ({
    width: 434,
    marginLeft: 16,
    paddingLeft: 16,
    paddingRight: 10,
    "& input": {
      background: "transparent !important",
      paddingLeft: "4px !important",
    },
    [theme.breakpoints.down("lg")]: {
      width: 350,
    },
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginLeft: 4,
      background: "#fff",
    },
  })
);

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(
  ({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.primary.light,
    color: theme.palette.primary.dark,
    "&:hover": {
      background: theme.palette.primary.dark,
      color: theme.palette.primary.light,
    },
  })
);

// ==============================|| SEARCH INPUT - MOBILE||============================== //

const MobileSearch = ({ value, setValue, popupState, ...otherProps }) => {
  const theme = useTheme();

  return (
    <OutlineInputStyle
      id="input-search-header"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <IconSearch
            stroke={1.5}
            size="1rem"
            color={theme.palette.grey[500]}
          />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <ButtonBase sx={{ borderRadius: "4px" }}>
            <HeaderAvatarStyle variant="rounded">
              <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
            </HeaderAvatarStyle>
          </ButtonBase>
          <Box sx={{ ml: 1 }}>
            <ButtonBase sx={{ borderRadius: "12px" }}>
              <Avatar
                variant="rounded"
                sx={{
                  ...theme.typography.commonAvatar,
                  ...theme.typography.mediumAvatar,
                  background: theme.palette.orange.light,
                  color: theme.palette.orange.dark,
                  "&:hover": {
                    background: theme.palette.orange.dark,
                    color: theme.palette.orange.light,
                  },
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="1.3rem" />
              </Avatar>
            </ButtonBase>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      inputProps={{ "aria-label": "weight" }}
      {...otherProps}
    />
  );
};

MobileSearch.propTypes = {
  value: PropTypes.string,
  setValue: PropTypes.func,
  popupState: PopupState,
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Use the debounce hook
  const debouncedSearch = useDebounce(value, 500); // Adjust delay as needed

  const fetchSearchSuggestions = async () => {
    if (debouncedSearch.length < 3) {
      setSuggestions([]);
      return; // Don't make API call if search query is too short
    }

    try {
      const response = await api.get(
        `/search/suggestions?query=${debouncedSearch}`
      );
      setSuggestions(response.data.data); // Store suggestions in state
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      fetchSearchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch]);

  const navigate = useNavigate();

  const fetchSearchResults = async (query) => {
    if (query) {
      setSuggestions([]);
      setValue(query);
      navigate(`/search?q=${query}`);
    }
  };

  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: "12px" }}>
                  <HeaderAvatarStyle
                    variant="rounded"
                    {...bindToggle(popupState)}
                  >
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <Transitions
                    type="zoom"
                    {...TransitionProps}
                    sx={{ transformOrigin: "center left" }}
                  >
                    <Card
                      sx={{
                        background: "#fff",
                        [theme.breakpoints.down("sm")]: {
                          border: 0,
                          boxShadow: "none",
                        },
                      }}
                    >
                      <Box sx={{ p: 1 }}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item xs>
                            <MobileSearch
                              value={value}
                              setValue={setValue}
                              popupState={popupState}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  fetchSearchResults(value);
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Card>

                    {suggestions?.length > 0 && (
                      <Box sx={{ position: "relative" }}>
                        <Box
                          sx={{
                            mt: 1,
                            position: "absolute",
                            top: "100%",
                            width: "100%",
                            bgcolor: "background.paper",
                            borderRadius: 4,
                            border: "1px solid",
                            borderColor: "primary.light",
                          }}
                        >
                          <List
                            subheader={
                              <ListSubheader
                                component="div"
                                id="nested-list-subheader"
                              >
                                Search Suggestions
                              </ListSubheader>
                            }
                          >
                            {suggestions?.map((suggestion, index) => (
                              <ListItem key={index} disablePadding>
                                <ListItemButton
                                  sx={{ borderRadius: 2 }}
                                  onClick={() => fetchSearchResults(suggestion)}
                                >
                                  <ListItemText primary={suggestion} />
                                </ListItemButton>
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Box>
                    )}
                  </Transitions>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <OutlineInputStyle
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          size="small"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchSearchResults(value);
            }
          }}
          startAdornment={
            <InputAdornment position="start">
              <IconSearch
                stroke={1.5}
                size="1rem"
                color={theme.palette.grey[500]}
              />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <ButtonBase sx={{ borderRadius: "12px" }}>
                <HeaderAvatarStyle
                  variant="rounded"
                  sx={{ height: 26, width: 26 }}
                >
                  <IconAdjustmentsHorizontal stroke={1.5} size="1.1rem" />
                </HeaderAvatarStyle>
              </ButtonBase>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{ "aria-label": "weight" }}
        />

        {suggestions?.length > 0 && (
          <Box sx={{ position: "relative", ml: 2 }}>
            <Box
              sx={{
                mt: 2,
                position: "absolute",
                top: "100%",
                width: "100%",
                bgcolor: "background.paper",
                borderRadius: 4,
                border: "1px solid",
                borderColor: "primary.light",
              }}
            >
              <List
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Search Suggestions
                  </ListSubheader>
                }
              >
                {suggestions?.map((suggestion, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      sx={{ borderRadius: 2 }}
                      onClick={() => fetchSearchResults(suggestion)}
                    >
                      <ListItemText primary={suggestion} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SearchSection;
