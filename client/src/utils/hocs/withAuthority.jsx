import React from "react";
import { useSelector } from "react-redux";

export const withAuthority = (WrappedComponent) => {
  const AuthorityContainer = ({ id, children }) => {
    console.log("id: ", id)
    const authUser = useSelector((state) => state.auth.user);

    // Check if the authenticated user exists and if the provided id matches the user's id
    const isAuthorized = authUser && authUser.id === id;

    // Render the wrapped component if authorized, otherwise render null
    return isAuthorized ? (
      <WrappedComponent>{children}</WrappedComponent>
    ) : null;
  };

  return AuthorityContainer;
};

const AuthorizedContainer = withAuthority(({ children }) => <>{children}</>);

export default AuthorizedContainer;
