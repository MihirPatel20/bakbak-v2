import React from "react";
import { Box, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { styled } from "@mui/system";
import generateExploreGrid from "utils/helpers/generateExploreGrid";

const GridLayout = ({ numberOfElements, cols }) => {
  const {
    items,
    rows,
    cols: gridCols,
  } = generateExploreGrid(numberOfElements, cols);

  return (
    <Box p={4}>
      <ImageList cols={gridCols} rowHeight={180}>
        {items.map((item) => (
          <ImageListItem
            key={item.id}
            cols={item.colSpan}
            rows={item.rowSpan}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#4caf50",
              color: "white",
              fontSize: "20px",
              borderRadius: "8px",
              height: "100px",
            }}
          >
            <ImageListItemBar title={`Item ${item.id + 1}`} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

const Test = () => {
  return (
    <div>
      <h1>Dynamic Grid Layout</h1>
      <GridLayout numberOfElements={27} cols={5} />
    </div>
  );
};

export default Test;
