import React from "react";
import * as AdaptiveCards from "adaptivecards";
import * as ACData from "adaptivecards-templating";
import { dateData, day, month } from "../../common";
import { ITileAdaptiveCardConfig } from "../tiles/Tile";

export interface AdaptiveCardTileProps {
  readonly fgColor?: string;
  readonly config: ITileAdaptiveCardConfig;
}

export interface AdaptiveCardState {
  readonly data: any;
}
export default class AdaptiveCardTile extends React.Component<
  AdaptiveCardTileProps,
  AdaptiveCardState
> {
  constructor(props: AdaptiveCardTileProps) {
    super(props);
    this.state = {
      data: null
    };
  }
  componentDidMount() {
    const variablesData = {
      today: {
        date: dateData,
        day: day,
        month: month
      }
    };
    if (!this.props.config.dataSource) {
      this.setState({ data: variablesData });
    } else {
      const token = this.props.config.token || "";
      const url = this.props.config.dataSource;
      let headers: any = { Accept: "application/json" };
      if (token) {
        headers["Authorization"] = token;
      }
      fetch(`${url}`, {
        method: "GET",
        headers: headers
      })
        .then(response => response.json())
        .then(data => {
          if (this.props.config.title) {
            data["TileTitle"] = this.props.config.title;
          }
          this.setState({ data: data });
        });
    }
  }

  render() {
    if (this.state.data) {
      const containerStyles = this.props.fgColor
        ? {
            default: {
              foregroundColors: {
                default: {
                  default: this.props.fgColor
                }
              }
            }
          }
        : {};

      const adaptiveCard = new AdaptiveCards.AdaptiveCard();
      adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
        containerStyles
      });
      adaptiveCard.onExecuteAction = (action: any) => {
        if (action && action.url) {
          window.open(
            (this.props.config.linkBase ? this.props.config.linkBase : "") +
              action.url,
            "_blank"
          );
        }
      };

      const template = new ACData.Template(this.props.config.payload);
      const context = new ACData.EvaluationContext();
      context.$root = this.state.data;
      const expandedCardPayload = template.expand(context);
      adaptiveCard.parse(expandedCardPayload);

      return (
        <div
          ref={node => {
            if (node) {
              while (node.firstChild) {
                node.removeChild(node.firstChild);
              }
              node.appendChild(adaptiveCard.render());
            }
          }}
        />
      );
    } else {
      return <div>Loading</div>;
    }
  }
}
