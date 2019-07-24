import {
  Panel,
  TextField,
  PanelType,
  Stack,
  Dropdown,
  IStackTokens,
  IDropdownOption,
  SwatchColorPicker,
  Label,
  findIndex,
  IStackItemStyles,
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
  ComboBox
} from "office-ui-fabric-react";
import React from "react";
import { IState, Dispatch } from "../../redux/store";
import { connect } from "react-redux";
import { selectTile } from "../../redux/actions";
import Tile, {
  ITileConfig,
  TileType,
  getTileInitState,
  TileState,
  ITileAdaptiveCardConfig
} from "../tiles/Tile";
import {
  getTileConfig,
  saveTileConfigs,
  deleteTileFromGroup,
  getTiles
} from "../../repo-utility";
import TilesGroup from "../tiles/TilesGroup";
import { tileColors } from "../../common";
import { Icons } from "../../icons";

interface ISidePanelProps {
  readonly selectedTileId: string | null;
  readonly deselectTile?: () => void;
  readonly refreshParent?: () => void;
}

class SidePanel extends React.Component<
  ISidePanelProps,
  { config: ITileConfig; selected: string; preview: boolean }
> {
  constructor(props: ISidePanelProps) {
    super(props);
    const tileConfig =
      (this.props.selectedTileId &&
        getTileConfig(this.props.selectedTileId.split("@")[1])) ||
      getTileInitState();
    const tileId: string =
      (this.props.selectedTileId && this.props.selectedTileId.split("@")[1]) ||
      "";
    this.state = {
      config: tileConfig,
      selected: "default",
      preview: tileId === "system-tile-add"
    };
  }

  renderFooter = (): JSX.Element => {
    return (
      <>
        <PrimaryButton
          onClick={() => {
            const groupId: string =
              (this.props.selectedTileId &&
                this.props.selectedTileId.split("@")[0]) ||
              "";
            const tileId: string =
              (this.props.selectedTileId &&
                this.props.selectedTileId.split("@")[1]) ||
              "";
            const isAdd: boolean = tileId === "system-tile-add";
            saveTileConfigs(
              groupId,
              {
                ...this.state.config
              },
              isAdd,
              () => {
                this.props.refreshParent && this.props.refreshParent();
                this.props.deselectTile && this.props.deselectTile();
              }
            );
          }}
        >
          Save
        </PrimaryButton>{" "}
        <DefaultButton
          disabled={
            (this.props.selectedTileId &&
              this.props.selectedTileId.split("@")[1]) === "system-tile-add"
          }
          onClick={() => {
            const groupId: string =
              (this.props.selectedTileId &&
                this.props.selectedTileId.split("@")[0]) ||
              "";
            const tileId: string =
              (this.props.selectedTileId &&
                this.props.selectedTileId.split("@")[1]) ||
              "";
            deleteTileFromGroup(groupId, tileId, () => {
              this.props.refreshParent && this.props.refreshParent();
              this.props.deselectTile && this.props.deselectTile();
            });
          }}
        >
          Delete
        </DefaultButton>
      </>
    );
  };

  componentWillReceiveProps(props: ISidePanelProps) {
    const tileId: string =
      (props.selectedTileId && props.selectedTileId.split("@")[1]) || "";
    const tileConfig = getTileConfig(tileId) || getTileInitState();

    this.setState({
      config: tileConfig,
      preview: tileId === "system-tile-add"
    });
  }

  render() {
    return (
      this.props.selectedTileId && (
        <Panel
          isOpen={!!this.props.selectedTileId}
          className={"add-title-panel"}
          styles={{
            hiddenPanel: "add-title-hidden-panel",
            main: "add-title-main-panel"
          }}
          type={PanelType.medium}
          onDismiss={this.props.deselectTile}
          headerText={"Tile Behaviour"}
          onRenderFooterContent={() => this.renderFooter()}
        >
          {!this.state.preview ? (
            <Pivot
              selectedKey={this.state.selected}
              onLinkClick={e => this.onLinkClick(e)}
            >
              <PivotItem itemKey="default" headerText="Default State">
                {this._renderTileSettingPanel(true)}
              </PivotItem>
              {this.state.config.expandedState && (
                <PivotItem itemKey="active" headerText="Click State">
                  {this._renderTileSettingPanel(false)}
                </PivotItem>
              )}
              {this.state.config.expandedState ? (
                <PivotItem itemIcon="Delete" itemKey="-" />
              ) : (
                <PivotItem itemIcon="Add" itemKey="+" headerText="Click State" />
              )}
            </Pivot>
          ) : (
            <TilesGroup
              id="systemside-preview"
              name="Use one of the below templates to proceed:"
              width={7}
              tileIds={[]}
            >
              {getTiles().map(tile => (
                <Tile
                  {...{ ...tile, expandedState: null }}
                  previewTile={() =>
                    this.setState({
                      config: { ...tile, ...{ id: "system-tile-add" } },
                      preview: false
                    })
                  }
                />
              ))}
            </TilesGroup>
          )}
        </Panel>
      )
    );
  }

  public onLinkClick(item: PivotItem | undefined): void {
    const key = item && item.props.itemKey;
    if (key) {
      switch (key) {
        case "default":
        case "active":
          this.setState({ selected: key });
          break;
        case "+":
          const newState =
            this.state.config.expandedState ||
            JSON.parse(JSON.stringify(this.state.config.defaultState));
          this.setState({
            config: { ...this.state.config, ...{ expandedState: newState } },
            selected: "active"
          });
          break;
        case "-":
          this.setState({
            config: { ...this.state.config, ...{ expandedState: null } },
            selected: "default"
          });
          break;
      }
    }
  }

  private _renderTileSettingPanel = (isDefault: boolean): JSX.Element => {
    const stackTokens: IStackTokens = { childrenGap: 5, padding: 10 };
    const tileState =
      isDefault && this.state.config
        ? this.state.config.defaultState
        : !isDefault && this.state.config && this.state.config.expandedState
        ? this.state.config.expandedState
        : getTileInitState().defaultState;
    const tileType: IDropdownOption[] = [
      {
        key: "link",
        selected: tileState.type === "link",
        text: "Redirect Link Tile"
      },
      {
        key: "adaptive-card",
        selected: tileState.type === "adaptive-card",
        text: "Adaptive Card Tile"
      },
      {
        key: "website",
        selected: tileState.type === "website",
        text: "Embedded website Tile"
      }
    ];

    const authOptions: IDropdownOption[] = [
      {
        key: "no-auth",
        selected:
          tileState.adaptiveCardConfig &&
          tileState.adaptiveCardConfig.auth === "no-auth",
        text: "No Authentication"
      },
      {
        key: "graph",
        selected:
          tileState.adaptiveCardConfig &&
          tileState.adaptiveCardConfig.auth === "graph",
        text: "Graph API"
      },
      {
        key: "vsts",
        selected:
          tileState.adaptiveCardConfig &&
          tileState.adaptiveCardConfig.auth === "vsts",
        text: "Azure DevOps"
      }
    ];
    const heightOptions: IDropdownOption[] = [
      {
        key: "1",
        selected: tileState.size.height === 1,
        text: "1"
      },
      {
        key: "2",
        selected: tileState.size.height === 2,
        text: "2"
      },
      {
        key: "3",
        selected: tileState.size.height === 3,
        text: "3"
      },
      {
        key: "4",
        selected: tileState.size.height === 4,
        text: "4"
      },
      {
        key: "5",
        selected: tileState.size.height === 5,
        text: "5"
      },
      {
        key: "6",
        selected: tileState.size.height === 6,
        text: "6"
      }
    ];

    const widthOptions: IDropdownOption[] = [
      {
        key: "1",
        selected: tileState.size.width === 1,
        text: "1"
      },
      {
        key: "2",
        selected: tileState.size.width === 2,
        text: "2"
      },
      {
        key: "3",
        selected: tileState.size.width === 3,
        text: "3"
      },
      {
        key: "4",
        selected: tileState.size.width === 4,
        text: "4"
      },
      {
        key: "5",
        selected: tileState.size.width === 5,
        text: "5"
      },
      {
        key: "6",
        selected: tileState.size.width === 6,
        text: "6"
      }
    ];

    const stackItemStyles: IStackItemStyles = {
      root: {
        alignItems: "center",
        display: "flex",
        paddingLeft: 10
      }
    };
    return (
      <>
        <Stack tokens={stackTokens}>
          <Stack horizontal>
            <Stack.Item grow={1}>
              <Dropdown
                required
                label="Tile Type"
                options={tileType}
                onChange={(e, value) => {
                  this.setState({
                    config: changeInState(
                      this.state.config,
                      isDefault,
                      this.changeConfigForTile(
                        ((value && value.key) as TileType) || "link"
                      )
                    )
                  });
                }}
              />
            </Stack.Item>
            <Stack.Item grow={1} styles={stackItemStyles}>
              <Stack>
                <Stack.Item grow styles={stackItemStyles}>
                  <Dropdown
                    label="Height"
                    options={heightOptions}
                    required
                    onChange={(e, value) => {
                      this.setState({
                        config: changeInState(this.state.config, isDefault, {
                          size: {
                            height: parseInt(
                              (value && value.key.toString()) || "1"
                            ),
                            width: tileState.size.width
                          }
                        })
                      });
                    }}
                  />
                  <Dropdown
                    required
                    label="Width"
                    options={widthOptions}
                    onChange={(e, value) => {
                      this.setState({
                        config: changeInState(this.state.config, isDefault, {
                          size: {
                            width: parseInt(
                              (value && value.key.toString()) || "1"
                            ),
                            height: tileState.size.height
                          }
                        })
                      });
                    }}
                  />
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
          <Stack horizontal tokens={{ childrenGap: 0 }}>
            <Stack.Item grow styles={{ root: { paddingRight: 20 } }}>
              <Label>Background Color</Label>
              <SwatchColorPicker
                columnCount={5}
                cellHeight={35}
                cellWidth={35}
                selectedId={
                  (
                    tileColors[
                      findIndex(
                        tileColors,
                        item => tileState.bgColor === item.color
                      )
                    ] || tileColors[0]
                  ).id
                }
                cellShape={"square"}
                colorCells={tileColors}
                onColorChanged={(id, color) => {
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      bgColor: color
                    })
                  });
                }}
              />
            </Stack.Item>
            <Stack.Item grow>
              <Label>Font Color</Label>
              <SwatchColorPicker
                columnCount={5}
                cellHeight={35}
                cellWidth={35}
                selectedId={
                  (
                    tileColors[
                      findIndex(
                        tileColors,
                        item => tileState.fgColor === item.color
                      )
                    ] || tileColors[0]
                  ).id
                }
                cellShape={"square"}
                colorCells={tileColors}
                onColorChanged={(id, color) => {
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      fgColor: color
                    })
                  });
                }}
              />
            </Stack.Item>
          </Stack>
          {tileState.type === "adaptive-card" && tileState.adaptiveCardConfig && (
            <>
              <TextField
                multiline
                rows={3}
                label="Adaptive Card JSON Payload"
                defaultValue={JSON.stringify(
                  tileState.adaptiveCardConfig.payload
                )}
                onChange={(v, t) =>
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      adaptiveCardConfig: {
                        payload: JSON.parse(t || "{}"),
                        dataSource:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.dataSource,
                        auth:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.auth,
                        token:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.token,
                        linkBase:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.linkBase
                      }
                    })
                  })
                }
                required
              />
              <a
                style={{ marginBottom: 5 }}
                href="https://vnext.adaptivecards.io/designer"
                target="_blank"
                rel="noopener noreferrer"
              >
                {"Design your own"}
              </a>
              <Stack horizontal>
                <Stack.Item>
                  <Dropdown
                    label="Authentication Type"
                    required
                    options={authOptions}
                    onChange={(v, t) =>
                      this.setState({
                        config: changeInState(this.state.config, isDefault, {
                          adaptiveCardConfig: {
                            payload:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.payload,
                            auth: t && t.key,
                            dataSource:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.dataSource,
                            token:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.token,
                            linkBase:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.linkBase
                          }
                        })
                      })
                    }
                  />
                </Stack.Item>
                {tileState.adaptiveCardConfig.auth === "graph" && (
                  <Stack.Item grow>
                    <TextField
                      label="Graph Token"
                      defaultValue={tileState.adaptiveCardConfig.token}
                      required
                      onChange={(v, t) =>
                        this.setState({
                          config: changeInState(this.state.config, isDefault, {
                            adaptiveCardConfig: {
                              payload:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.payload,
                              dataSource:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.dataSource,
                              auth:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.auth,
                              token: t,
                              linkBase:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.linkBase
                            }
                          })
                        })
                      }
                    />
                  </Stack.Item>
                )}
                {tileState.adaptiveCardConfig.auth === "vsts" && (
                  <Stack.Item grow>
                    <TextField
                      label="PAT Token"
                      defaultValue={tileState.adaptiveCardConfig.token}
                      required
                      onChange={(v, t) =>
                        this.setState({
                          config: changeInState(this.state.config, isDefault, {
                            adaptiveCardConfig: {
                              payload:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.payload,
                              dataSource:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.dataSource,
                              auth:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.auth,
                              token: t,
                              linkBase:
                                tileState.adaptiveCardConfig &&
                                tileState.adaptiveCardConfig.linkBase
                            }
                          })
                        })
                      }
                    />
                  </Stack.Item>
                )}
              </Stack>
              <TextField
                label="Resource URL"
                defaultValue={tileState.adaptiveCardConfig.dataSource}
                required
                onChange={(v, t) =>
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      adaptiveCardConfig: {
                        payload:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.payload,
                        dataSource: t,
                        auth:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.auth,
                        token:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.token,
                        linkBase:
                          tileState.adaptiveCardConfig &&
                          tileState.adaptiveCardConfig.linkBase
                      }
                    })
                  })
                }
              />
              {tileState.adaptiveCardConfig.auth === "graph" && (
                <>
                  <a
                    style={{ marginBottom: 5 }}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://developer.microsoft.com/en-us/graph/graph-explorer"
                  >
                    {"Microsoft Graph API Explorer"}
                  </a>
                </>
              )}
              {tileState.adaptiveCardConfig.auth === "vsts" && (
                <>
                  <a
                    style={{ marginBottom: 5 }}
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://docs.microsoft.com/en-us/rest/api/azure/devops/?view=azure-devops-server-rest-5.0"
                  >
                    {"Azure Devops API Documentation"}
                  </a>

                  <TextField
                    label="Project base URL"
                    defaultValue={tileState.adaptiveCardConfig.linkBase}
                    required
                    onChange={(v, t) =>
                      this.setState({
                        config: changeInState(this.state.config, isDefault, {
                          adaptiveCardConfig: {
                            payload:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.payload,
                            dataSource:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.dataSource,
                            auth:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.auth,
                            token:
                              tileState.adaptiveCardConfig &&
                              tileState.adaptiveCardConfig.linkBase,
                            linkBase: t
                          }
                        })
                      })
                    }
                  />
                </>
              )}
            </>
          )}
          {tileState.type === "website" && (
            <>
              <TextField
                label="Title"
                defaultValue={tileState.title}
                onChange={(v, t) =>
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      title: t
                    })
                  })
                }
              />
              <TextField
                label="Website URL"
                defaultValue={tileState.websiteLink}
                required
                onChange={(v, t) =>
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      websiteLink: t
                    })
                  })
                }
              />
            </>
          )}
          {tileState.type === "link" && (
            <>
              <TextField
                label="Redirect URL"
                defaultValue={tileState.redirectLink}
                required
                onChange={(v, t) =>
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      redirectLink: t
                    })
                  })
                }
              />
              <Stack horizontal>
                <Stack.Item grow styles={{ root: { paddingRight: 20 } }}>
                  <TextField
                    label="Title"
                    defaultValue={tileState.title}
                    onChange={(v, t) =>
                      this.setState({
                        config: changeInState(this.state.config, isDefault, {
                          title: t
                        })
                      })
                    }
                  />
                </Stack.Item>
                <Stack.Item grow>
                  <ComboBox
                    label="Icon"
                    text={tileState.iconClass}
                    options={Icons}
                    onChange={(v, t) =>
                      this.setState({
                        config: changeInState(this.state.config, isDefault, {
                          iconClass: t && t.key
                        })
                      })
                    }
                  />
                </Stack.Item>
              </Stack>
              <TextField
                label="Image Source"
                defaultValue={tileState.imageSrc}
                onChange={(v, t) =>
                  this.setState({
                    config: changeInState(this.state.config, isDefault, {
                      imageSrc: t
                    })
                  })
                }
              />
            </>
          )}
          <Stack.Item grow>
            <TilesGroup
              id="systemside-preview"
              name="Preview"
              width={tileState.size.width}
              tileIds={[]}
              style={{
                marginLeft: `calc(50% - ${Tile.computeDimension(
                  tileState.size.width
                ) / 2}px)`
              }}
            >
              <Tile {...{ defaultState: tileState, id: "1" }} />
            </TilesGroup>
          </Stack.Item>
        </Stack>
      </>
    );
  };

  public changeConfigForTile = (type: TileType, state?: TileState): any => {
    const adaptiveCardConfig: ITileAdaptiveCardConfig = {
      dataSource: "",
      auth: "no-auth",
      payload: {}
    };
    switch (type) {
      case "link":
        return { type, websiteLink: null, adaptiveCardConfig: null };
      case "adaptive-card":
        return {
          type,
          websiteLink: null,
          badge: null,
          imgSrc: null,
          iconClass: null,
          title: null,
          adaptiveCardConfig:
            (state && state.adaptiveCardConfig) || adaptiveCardConfig
        };
      case "website":
        return {
          type,
          badge: null,
          imgSrc: null,
          iconClass: null,
          adaptiveCardConfig: null
        };
    }
  };
}
const changeInState = (
  currentState: ITileConfig,
  isDefault: boolean,
  newObject: any
): ITileConfig => {
  if (isDefault) {
    return {
      ...currentState,
      ...{ defaultState: { ...currentState.defaultState, ...newObject } }
    };
  } else {
    return {
      ...currentState,
      ...{ expandedState: { ...currentState.expandedState, ...newObject } }
    };
  }
};

const mapStateToProps = (state: IState) => ({
  selectedTileId: state.selectedTileId
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  deselectTile: () => dispatch(selectTile(null))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidePanel);
