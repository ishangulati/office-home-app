export enum TileSize {
  Normal = "tile-medium",
  Wide = "tile-wide",
  Small = "tile-small",
  Large = "tile-large"
}

export const tileColors: any[] = [
  { id: 0, label: "indigo", color: "#6a00ff" },
  { id: 1, label: "default", color: "#1ba1e2" },
  { id: 2, label: "cyan", color: "#00FFFF " },
  { id: 3, label: "teal", color: "#00aba9" },
  { id: 4, label: "darkBlue", color: "#16499a" },
  { id: 5, label: "green", color: "#60a917" },
  { id: 6, label: "darkGreen", color: "#128023" },
  { id: 7, label: "white", color: "#ffffff" },
  { id: 8, label: "darkRed", color: "#9a1616" },
  { id: 9, label: "red", color: "#CE352C" },
  { id: 10, label: "amber", color: "#f0a30a" },
  { id: 11, label: "cream", color: "#fffdd0 " },
  { id: 12, label: "steel", color: "#647687" },
  { id: 13, label: "yellow", color: "#e3c800" },
  { id: 14, label: "pink", color: "#dc4fad" },
  { id: 15, label: "orange", color: "#fa6800" },
  { id: 16, label: "brown", color: "#825a2c" },
  { id: 17, label: "chocolateBrown", color: "#D2691E " },
  { id: 18, label: "coral", color: "#f88379" },
  { id: 19, label: "black", color: "#000000" }
];

export enum TileBgColor {
  Cyan = "bg-cyan",
  Orange = "bg-orange",
  Indigo = "bg-indigo",
  DarkBlue = "bg-darkBlue",
  Red = "bg-red",
  Teal = "bg-teal",
  Brown = "bg-brown",
  Green = "bg-green",
  Blue = "bg-blue",
  Amber = "bg-amber",
  Pink = "bg-pink",
  Yellow = "bg-yellow",
  Steel = "bg-steel",
  DarkPink = "bg-darkPink",
  DarkOrange = "bg-darkOrange",
  Violet = "bg-violet",
  LightBlue = "bg-lightBlue",
  DarkGreen = "bg-darkGreen",
  White = "bg-white"
}

export enum TileFgColor {
  White = "fg-white",
  Black = "fg-black"
}

export enum TileIcon {
  Envelop = "envelop",
  Github = "github",
  Add = "add",
  Calendar = "calendar"
}

export interface TileSizeUnit {
  readonly height: number;
  readonly width: number;
}

export enum Weekdays {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export enum Months {
  January = 0,
  February = 1,
  March = 2,
  April = 3,
  May = 4,
  June = 5,
  July = 6,
  August = 7,
  September = 8,
  October = 9,
  November = 10,
  December = 11
}

var theDay = new Date();
var dd = String(theDay.getDate()).padStart(2, "0");
var mm = String(theDay.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = theDay.getFullYear();
export var today = yyyy + "-" + mm + "-" + dd;
export var dateData = mm + "-" + dd + "-" + yyyy;
export var day = String(Weekdays[theDay.getDay()]);
export var month = String(Months[theDay.getMonth()]);
