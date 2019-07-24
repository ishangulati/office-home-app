import React from "react";
import { TileSizeUnit } from "../../common";

export default class TableCell extends React.Component<{
  onSizeSelect?: (s: TileSizeUnit) => void;
  width: number;
  height: number;
}> {
  render() {
    return (
      <td
        onClick={() =>
          this.props.onSizeSelect &&
          this.props.onSizeSelect({
            height: this.props.height,
            width: this.props.width
          })
        }
        style={{
          border: "1px solid black",
          height: 20,
          width: 20,
          color: "blue"
        }}
      />
    );
  }
}
