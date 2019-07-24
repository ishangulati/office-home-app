import React from "react";
import Tile, { ITileConfig } from "./Tile";
import { getTileConfig } from "../../repo-utility";
import { connect } from "react-redux";
import { IState } from "../../redux/store";
import GroupEdit from "./GroupEdit";

export interface ITileGroupConfig {
  readonly id: string;
  readonly width: number;
  readonly name: string;
  readonly tileIds: string[];
  readonly style?: any;
}

export interface ITileGroupComponentProps extends ITileGroupConfig {
  readonly isEditMode: boolean;
}

class TilesGroup extends React.Component<ITileGroupComponentProps> {
  getTileComponent(tileId: string) {
    const tile: ITileConfig = getTileConfig(tileId);
    return (
      <Tile tileId={this.props.id + "@" + tileId} {...tile} key={tileId} />
    );
  }

  render() {
    const addConfig = getTileConfig("system-tile-add");
    return (
      <>
        <div
          className={`tiles-grid tiles-group size-${this.props.width / 2}`}
          data-group-title={this.props.name}
          style={{ ...{ left: 0 }, ...this.props.style }}
        >
          {this.props.isEditMode && this.props.id !== "systemside-preview" && <GroupEdit {...this.props} />}
          {this.props.children}
          {this.props.tileIds.map((tileId: string) =>
            this.getTileComponent(tileId)
          )}
          {this.props.isEditMode &&
            addConfig &&
            this.props.id !== "systemside-preview" && (
              <Tile
                tileId={this.props.id + "@system-tile-add"}
                {...addConfig}
              />
            )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  isEditMode: state.isEditMode
});

export default connect(
  mapStateToProps,
  null
)(TilesGroup);
