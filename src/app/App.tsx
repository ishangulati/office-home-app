import React from "react";
import "./App.css";
import TilesGroup from "../components/tiles/TilesGroup";
import { getGroups } from "../repo-utility";
import Heading from "../components/common/Heading";
import SidePanel from "../components/settingsPanel/SidePanel";
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons(/* optional base url */);

class App extends React.Component {
  public render(): JSX.Element {
    return (
      <>
        <Heading />
        <div className="tiles-area clear">
          {getGroups().map(group => {
            return <TilesGroup {...group} key={group.id} />;
          })}
          <SidePanel refreshParent={this._updateComponent} />
        </div>
      </>
    );
  }

  private _updateComponent = (): void => {
    this.forceUpdate();
  };
}

export default App;
