import React, { createContext, useState, useContext } from "react";

// Create the context with default values
const PostDialogContext = createContext();

export const PostDialogProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [postId, setPostId] = useState(null);

  const openDialog = (id) => {
    console.log("Opening dialog for post:", id);
    setPostId(id);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setPostId(null);
    setIsOpen(false);
  };

  return (
    <PostDialogContext.Provider
      value={{ isOpen, postId, openDialog, closeDialog }}
    >
      {children}
    </PostDialogContext.Provider>
  );
};

// Custom hook to use the PostDialogContext
export const usePostDialog = () => {
  const context = useContext(PostDialogContext);
  if (context === undefined) {
    throw new Error("usePostDialog must be used within a PostDialogProvider");
  }
  return context;
};
