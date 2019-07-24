import { find, findIndex } from "@uifabric/utilities/lib/array";
import { ITileConfig } from "./components/tiles/Tile";
import { ITileGroupConfig } from "./components/tiles/TilesGroup";
import TileGroupsData from "./data.groups.json";
import TilesData from "./data.tiles.json";

export const saveTileConfigs = (
  groupId: string,
  addedData: ITileConfig,
  isAdd: boolean,
  refreshParent: () => void
): void => {
  const tilesData: ITileConfig[] = getTiles();
  const groupData: ITileGroupConfig = getGroup(groupId);

  if (isAdd) {
    const id = Date.now().toString();
    tilesData.push({ ...addedData, ...{ id } });
    groupData.tileIds.push(id);
  } else {
    const index = findIndex(tilesData, tile => tile.id === addedData.id);
    tilesData[index === -1 ? tilesData.length : index] = addedData;
  }
  setTiles(tilesData);
  saveTileGroupConfigs(groupData, false);
  refreshParent();
};

export const deleteTileFromGroup = (
  groupId: string,
  tileId: string,
  refreshParent: () => void
): void => {
  const groupData: ITileGroupConfig = getGroup(groupId);
  const index = groupData.tileIds.indexOf(tileId);
  groupData.tileIds.splice(index, 1);

  saveTileGroupConfigs({ ...groupData }, false);
  refreshParent();
};

export const saveTileGroupConfigs = (
  groupData: ITileGroupConfig,
  isAdd: boolean,
  refreshParent?: () => void,
  afterId?: string
) => {
  const groups: ITileGroupConfig[] = getGroups();
  if (isAdd) {
    if (afterId) {
      const index = groups.findIndex(group => group.id === afterId);
      groups.splice(index + 1, 0, groupData);
    } else {
      groups.push(groupData);
    }
  } else {
    const index = groups.findIndex(group => group.id === groupData.id);
    groups[index === -1 ? groups.length : index] = groupData;
  }
  setGroups(groups);
  refreshParent && refreshParent();
};

export const deleteGroup = (groupId: string, refreshParent?: () => void) => {
  const groups: ITileGroupConfig[] = getGroups();
  const index = groups.findIndex(group => group.id === groupId);
  if (index !== -1) {
    groups.splice(index, 1);
  }
  setGroups(groups);
  refreshParent && refreshParent();
};

export const getTileConfig: (tileId: string) => ITileConfig = (
  tileId: string
) => {
  return find(getTiles(), tile => tile.id === tileId) as ITileConfig;
};

export const getGroup: (groupId: string) => ITileGroupConfig = (
  groupId: string
) => {
  return find(getGroups(), group => group.id === groupId) as ITileGroupConfig;
};
export const getGroups: () => ITileGroupConfig[] = () =>
  JSON.parse(localStorage.getItem("groups") || "[]");

export const setGroups: (data: ITileGroupConfig[]) => void = (
  data: ITileGroupConfig[]
) => localStorage.setItem("groups", JSON.stringify(data));

(() => {
  if (!localStorage.getItem("groups")) {
    localStorage.setItem("groups", JSON.stringify(TileGroupsData));
  }
  if (!localStorage.getItem("tiles")) {
    localStorage.setItem("tiles", JSON.stringify(TilesData));
  }
})();

export const getTiles: () => ITileConfig[] = () =>
  JSON.parse(localStorage.getItem("tiles") || "[]");

export const setTiles: (data: ITileConfig[]) => void = (data: ITileConfig[]) =>
  localStorage.setItem("tiles", JSON.stringify(data));
