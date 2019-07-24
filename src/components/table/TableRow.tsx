import React from "react";
import TableCell from "./TableCell";
import { TileSizeUnit } from "../../common";

export default class TableRow extends React.Component<{
  onSizeSelect?: (s: TileSizeUnit) => void;
  height: number;
}> {
  render() {
    return (
      <tr>
        {[1, 2, 3, 4, 5, 6].map(s => (
          <TableCell
            onSizeSelect={this.props.onSizeSelect}
            height={this.props.height}
            width={s}
          />
        ))}
      </tr>
    );
  }
}
