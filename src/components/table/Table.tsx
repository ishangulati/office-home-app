import React from "react";
import TableRow from "./TableRow";
import { TileSizeUnit } from "../../common";

export default class Table extends React.Component<{
  onSizeSelect?: (s: TileSizeUnit) => void;
}> {
  render() {
    return (
      <table>
        <tbody
          style={{
            backgroundColor: "white"
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(s => (
            <TableRow onSizeSelect={this.props.onSizeSelect} height={s} />
          ))}
        </tbody>
      </table>
    );
  }
}
