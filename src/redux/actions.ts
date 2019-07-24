export const toggleMode = () => ({
  type: "TOGGLE_MODE"
});

export const selectTile = (id: string | null) => ({
    type: "SET_SELECTED_TILE",
    id
  });