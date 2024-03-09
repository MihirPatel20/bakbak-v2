import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { ButtonBase } from "@mui/material";

// project imports
import config from "config";
import Logo from "ui-component/Logo";
import { MENU_OPEN } from "reducer/customization/actions";
import BakbakLogo from "components/global/BakbakLogo";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
      
    >
      {/* <Logo /> */}
      <BakbakLogo sx={{fontSize: "1.7rem"}}/>
    </ButtonBase>
  );
};

export default LogoSection;
