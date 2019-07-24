import React from "react";
import { TileSizeUnit } from "../../common";
import WebsiteComponent from "../websiteIframe/WebsiteComponent";
import AdaptiveCardTile from "../adaptiveCard/AdaptiveCardTile";
import { IState, Dispatch } from "../../redux/store";
import { connect } from "react-redux";
import { selectTile } from "../../redux/actions";
import "./Tile.css";

const renderedStyle = {
  opacity: 1,
  transform: "scale(1)",
  transition: "all 0.3s ease 0s"
};

export type TileType = "link" | "adaptive-card" | "website";
export interface TileState {
  readonly type: TileType;
  readonly size: TileSizeUnit;
  readonly bgColor?: string;
  readonly fgColor?: string;
  readonly title?: string;
  readonly badge?: string;
  readonly iconClass?: string;
  readonly adaptiveCardConfig?: ITileAdaptiveCardConfig; 
  readonly imageSrc?: string;
  readonly websiteLink?: string;
  readonly redirectLink?: string;
  readonly additionalClass?:string;
}

export interface ITileConfig {
  readonly id: string;
  readonly defaultState: TileState;
  readonly expandedState?: TileState | null;
  readonly isEditMode?: boolean;
}
export interface ITileAdaptiveCardConfig{
  dataSource: string;
  readonly auth: "no-auth" | "graph" | "vsts";
  readonly payload: any;
  readonly title?: string
  readonly token?: string;
  readonly linkBase?: string;
}

interface ITileComponentProps extends ITileConfig {
  readonly selectTile?: (id: string) => void;
  readonly tileId?: string;
  readonly isSelected?: boolean;
  readonly previewTile?: () => void;
}

interface TileComponentState {
  readonly rendered: boolean;
  readonly currentState: TileState;
  readonly expanded: boolean;
  readonly additionalClass?: string;
}

export const getTileInitState: () => ITileConfig = () => {
  return {
    id: Date.now().toString(),
    defaultState: {
      size: { height: 1, width: 1 },
      type: "link"
    }
  };
};

class Tile extends React.Component<ITileComponentProps, TileComponentState> {
  constructor(props: ITileComponentProps) {
    super(props);
    this.state = {
      rendered: false,
      currentState: this.props.defaultState,
      expanded: false
    };
  }
  componentDidMount() {
    setTimeout(() => this.setState({ rendered: true }), 0);
  }

  componentWillReceiveProps(nextProps: ITileConfig) {
    this.setState({
      currentState: !this.state.expanded
        ? nextProps.defaultState
        : nextProps.expandedState || getTileInitState().defaultState
    });
  }

  onClickHandler(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if( this.props.previewTile){
      this.props.previewTile();
    }
    if (this.props.isEditMode) {
      this.props.tileId &&
        this.props.selectTile &&
        this.props.selectTile(this.props.tileId);
      e.preventDefault();
    } else if (
      this.state.currentState.type === "link" &&
      this.state.currentState.redirectLink
    ) {
      window.open(this.state.currentState.redirectLink, "_blank");
    } else if (this.props.expandedState) {
      this.setState({
        currentState: this.state.expanded
          ? this.props.defaultState
          : this.props.expandedState,
        expanded: !this.state.expanded
      });
    }
  }

  static computeDimension(unit: number) {
    return unit * 70 + 10 * (unit - 1);
  }

  getCurrentSize() {
    return this.state.currentState.size;
  }

  render() {
    const currentSize = this.getCurrentSize();

    const style = {
      gridColumn: `span ${currentSize.width}`,
      gridRow: `span ${currentSize.height}`,
      width: Tile.computeDimension(currentSize.width),
      height: Tile.computeDimension(currentSize.height)
    };

    const defaultSizeClass =
      currentSize.height === 1
        ? "tile-small"
        : currentSize.height === 2
        ? "tile-medium"
        : currentSize.height === 4
        ? "tile-wide"
        : "tile-large";

    return (
      <div
        onClick={e => this.onClickHandler(e)}
        className={`${defaultSizeClass} ${
          this.props.isEditMode && this.props.isSelected ? "selected" : ""
        } ${
          this.state.currentState.additionalClass
            ? this.state.currentState.additionalClass
            : ""
        } tile-item`}
        data-role="tile"
        style={{
          ...style,
          ...(this.state.rendered ? renderedStyle : {}),
          backgroundColor: this.state.currentState.bgColor || "#ffffff" ,
          color: this.state.currentState.fgColor || "#000000"
        }}
      >
        {this.props.children}
        {this.state.currentState.websiteLink && (
          <WebsiteComponent
            websiteLink={this.state.currentState.websiteLink}
            title={this.state.currentState.title}
            size={{
              height: Tile.computeDimension(currentSize.height),
              width: Tile.computeDimension(currentSize.width)
            }}
          />
        )}
        {this.state.currentState.iconClass && (
          <span className={`mif-${this.state.currentState.iconClass} icon`} />
        )}
        {this.state.currentState.title && (
          <span className="branding-bar">{this.state.currentState.title}</span>
        )}
        {this.state.currentState.badge && (
          <span className="badge-bottom">{this.state.currentState.badge}</span>
        )}
        {this.state.currentState.adaptiveCardConfig && (
          <AdaptiveCardTile
            fgColor={this.state.currentState.fgColor}
            config={this.state.currentState.adaptiveCardConfig}
          />
        )}
        {this.state.currentState.imageSrc && (
          <img
            src={this.state.currentState.imageSrc}
            className="icon"
            alt="tile"
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: IState, props: ITileComponentProps) => ({
  isEditMode: state.isEditMode,
  isSelected: state.selectedTileId === props.tileId
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  selectTile: (id: string) => dispatch(selectTile(id))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tile);
