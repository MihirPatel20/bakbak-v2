const generateExploreGrid = (numberOfElements, cols) => {
  let rows = Math.ceil(numberOfElements / cols); // Start with an initial row count
  const items = [];
  let grid = Array.from({ length: rows }, () => Array(cols).fill(null));

  let itemCount = 0;
  const maxAttempts = numberOfElements * 10; // Avoid infinite loops

  const canPlaceItem = (r, c, rowSpan, colSpan) => {
    if (r + rowSpan > rows || c + colSpan > cols) return false;

    for (let i = r; i < r + rowSpan; i++) {
      for (let j = c; j < c + colSpan; j++) {
        if (grid[i][j] !== null) return false;
      }
    }
    return true;
  };

  const placeItem = (r, c, rowSpan, colSpan, id) => {
    for (let i = r; i < r + rowSpan; i++) {
      for (let j = c; j < c + colSpan; j++) {
        grid[i][j] = id;
      }
    }
    items.push({ id, colSpan, rowSpan, x: c, y: r });
  };

  const findAvailableSpace = () => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === null) return { r, c };
      }
    }
    return null;
  };

  const extendGrid = () => {
    const newRows = rows + Math.ceil(numberOfElements / cols);
    grid = Array.from({ length: newRows }, (_, i) =>
      i < rows ? grid[i] : Array(cols).fill(null)
    );
    rows = newRows;
  };

  let attempts = 0;
  while (itemCount < numberOfElements && attempts < maxAttempts) {
    const space = findAvailableSpace();
    if (space === null) {
      extendGrid(); // Extend the grid if no space is available
      continue; // Recheck after extending
    }

    const { r, c } = space;
    const colSpan = Math.random() < 0.5 ? 1 : 2;
    const rowSpan = Math.random() < 0.5 ? 1 : 2;

    if (canPlaceItem(r, c, rowSpan, colSpan)) {
      placeItem(r, c, rowSpan, colSpan, itemCount);
      itemCount++;
    }

    attempts++;
  }

  console.log("Grid:", grid);
  return { items, rows, cols };
};

export default generateExploreGrid;
