import React from "react";
import { TileSizeUnit } from "../../common";

export default class WebsiteComponent extends React.Component<{
  websiteLink: string;
  size: TileSizeUnit;
  title?: string;
}> {
  render() {
    return (
      <iframe
        src={this.props.websiteLink}
        title={this.props.title}
        height={this.props.size.height - 35}
        width={this.props.size.width}
      />
    );
  }
}
