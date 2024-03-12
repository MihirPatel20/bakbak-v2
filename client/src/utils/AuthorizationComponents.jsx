import useAuth from "hooks/useAuth";

export const OwnerComponent = ({ id, children }) => {
  const { user } = useAuth();

  // Check if the authenticated user exists and if the provided id matches the user's id
  const isOwner = user && user._id === id;

  // Render the children if authorized, otherwise render null
  return isOwner ? children : null;
};

export const VisitorComponent = ({ id, children }) => {
  const { user } = useAuth();

  // Check if the authenticated user exists and if the provided id does not match the user's id
  const isVisitor = user && user._id !== id;

  // Render the children if authorized, otherwise render null
  return isVisitor ? children : null;
};
