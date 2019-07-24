import { combineReducers, createStore, AnyAction, Reducer } from "redux";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: Function;
  }
}

export interface IState {
  isEditMode: boolean;
  selectedTileId: string | null;
}
const modeReducer: Reducer<boolean, AnyAction> = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_MODE":
      return !state;
    default:
      return state;
  }
};

const selectedTileReducer: Reducer<string | null, AnyAction> = (state = null, action) => {
  switch (action.type) {
    case "SET_SELECTED_TILE":
      return action.id;
    default:
      return state;
  }
};

export type Dispatch = (action: AnyAction) => void;

export default createStore<IState, any, any, any>(
  combineReducers<IState>({
    isEditMode: modeReducer,
    selectedTileId: selectedTileReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__({ name: "Dashboard" })
);
