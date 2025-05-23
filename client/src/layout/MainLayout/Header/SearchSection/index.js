import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// MUI
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
  ClickAwayListener,
  Paper,
} from "@mui/material";

// 3rd-party
import PopupState, { bindPopper, bindToggle } from "material-ui-popup-state";

// Assets
import {
  IconAdjustmentsHorizontal,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { shouldForwardProp, useMediaQuery } from "@mui/system";
import useDebounce from "hooks/useDebounce";
import api from "api";
import { useLocation, useNavigate } from "react-router-dom";
import Transitions from "ui-component/extended/Transitions";

// Styles
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

const MobileSearch = ({ popupState, ...otherProps }) => {
  const theme = useTheme();

  return (
    <OutlineInputStyle
      id="input-search-header"
      placeholder="Search"
      size="small"
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
            <HeaderAvatarStyle variant="rounded" sx={{ height: 26, width: 26 }}>
              <IconAdjustmentsHorizontal stroke={1.5} size="1.1rem" />
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
                  height: 26,
                  width: 26,
                }}
                {...bindToggle(popupState)}
              >
                <IconX stroke={1.5} size="1.1rem" />
              </Avatar>
            </ButtonBase>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      inputProps={{ "aria-label": "search" }}
      {...otherProps}
    />
  );
};

MobileSearch.propTypes = {
  popupState: PropTypes.object,
};

const SuggestionsList = ({ suggestions, handleSuggestionClick }) => {
  if (!suggestions?.length) return null;

  return (
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
        zIndex: 1200,
      }}
    >
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Search Suggestions
          </ListSubheader>
        }
      >
        {suggestions.map((suggestion, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ borderRadius: 2 }}
              onClick={(e) => {
                e.stopPropagation();
                handleSuggestionClick(suggestion);
              }}
            >
              <ListItemText primary={suggestion} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

SuggestionsList.propTypes = {
  suggestions: PropTypes.array,
  handleSuggestionClick: PropTypes.func,
};

// ==============================|| SEARCH INPUT ||============================== //

const SearchSection = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down("md"));
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [shouldFetchSuggestions, setShouldFetchSuggestions] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      setValue(query);
      setShouldFetchSuggestions(false);
    }
  }, [query]);

  const debouncedSearch = useDebounce(value, 500);

  const fetchSearchSuggestions = async () => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await api.get(
        `/search/suggestions?query=${debouncedSearch}`
      );
      setSuggestions(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  useEffect(() => {
    if (debouncedSearch && shouldFetchSuggestions) {
      fetchSearchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch, shouldFetchSuggestions]);

  const fetchSearchResults = async (query) => {
    if (query) {
      setShouldFetchSuggestions(false);
      setValue(query);
      navigate(`/search?q=${query}`);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    setShouldFetchSuggestions(true);
    setValue(e.target.value);
  };

  return (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <PopupState variant="popper" popupId="mobile-search-popper">
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
                    position={matchesXs ? "top" : "top-right"}
                    in={open}
                    {...TransitionProps}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={() => popupState.close()}>
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
                                  onChange={handleInputChange}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                      fetchSearchResults(value);
                                  }}
                                  popupState={popupState}
                                />
                              </Grid>
                            </Grid>
                          </Box>
                        </Card>
                      </ClickAwayListener>
                      <SuggestionsList
                        suggestions={suggestions}
                        handleSuggestionClick={(val) => {
                          fetchSearchResults(val);
                          popupState.close();
                        }}
                      />
                    </Paper>
                  </Transitions>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <ClickAwayListener onClickAway={() => setSuggestions([])}>
          <>
            <OutlineInputStyle
              id="input-search-header"
              value={value}
              onChange={handleInputChange}
              onClick={handleInputChange}
              placeholder="Search"
              size="small"
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchSearchResults(value);
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
                  <ButtonBase sx={{ borderRadius: "4px" }}>
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
              inputProps={{ "aria-label": "search" }}
            />
            <Box sx={{ position: "relative", ml: 0 }}>
              <SuggestionsList
                suggestions={suggestions}
                handleSuggestionClick={fetchSearchResults}
              />
            </Box>
          </>
        </ClickAwayListener>
      </Box>
    </>
  );
};

export default SearchSection;
