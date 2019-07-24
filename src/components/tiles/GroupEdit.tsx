import React from "react";
import {
  Dialog,
  DialogType,
  TextField,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownOption
} from "office-ui-fabric-react";
import { ITileGroupConfig } from "./TilesGroup";
import { saveTileGroupConfigs, deleteGroup } from "../../repo-utility";

export default class GroupEdit extends React.Component<
  ITileGroupConfig,
  {
    hideDialog: boolean;
    isEditMode: boolean;
    config: ITileGroupConfig;
  }
> {
  constructor(props: ITileGroupConfig) {
    super(props);
    this.state = { hideDialog: true, isEditMode: false, config: props };
  }

  render() {
    const selectedOptions: IDropdownOption[] = [
      { key: "1", text: "1", selected: this.props.width === 1 },
      { key: "2", text: "2", selected: this.props.width === 2 },
      { key: "3", text: "3", selected: this.props.width === 3 },
      { key: "4", text: "4", selected: this.props.width === 4 },
      { key: "5", text: "5", selected: this.props.width === 5 },
      { key: "6", text: "6", selected: this.props.width === 6 },
      { key: "7", text: "7", selected: this.props.width === 7 },
      { key: "8", text: "8", selected: this.props.width === 8 }
    ];
    return (
      <>
        <span
          style={{ position: "absolute", top: -33, right: 50 }}
          onClick={() => this._showDialog(true)}
          className={"mif-pencil fg-white"}
        />
        <span
          style={{ position: "absolute", top: -33, right: 25 }}
          onClick={() => {
            if (window.confirm(`Delete "${this.props.name}" group?`)) {
              deleteGroup(this.props.id, () => window.location.reload())
            }
          }}
          className={"mif-bin fg-white"}
        />
        <span
          style={{ position: "absolute", top: -37, right: 0 }}
          onClick={() => this._showDialog(false)}
          className={"mif-add mif-2x fg-white"}
        />
        <Dialog
          hidden={this.state.hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: this.state.isEditMode ? "Edit Group" : "Add New Group"
          }}
          modalProps={{
            isBlocking: false,
            styles: { main: { maxWidth: 450 } }
          }}
        >
          <TextField
            required
            label="Group Name"
            onChange={(e, t) =>
              this.setState({
                config: {
                  name: t || "",
                  width: this.state.config.width,
                  id: this.state.config.id,
                  tileIds: this.state.config.tileIds
                }
              })
            }
            defaultValue={this.state.config.name}
          />
          <Dropdown
            required
            label="Width Units"
            onChange={(e, t) =>
              this.setState({
                config: {
                  name: this.state.config.name,
                  width: parseInt((t && t.key.toString()) || "4"),
                  id: this.state.config.id,
                  tileIds: this.state.config.tileIds
                }
              })
            }
            options={selectedOptions}
          />
          <DialogFooter>
            <PrimaryButton
              onClick={() => {
                if (!this.state.isEditMode) {
                  this.setState(
                    {
                      config: {
                        ...this.state.config,
                        ...{ id: Date.now().toString(), tileIds: [] }
                      }
                    },
                    () => {
                      saveTileGroupConfigs(
                        this.state.config,
                        !this.state.isEditMode,
                        () => {
                          this._closeDialog();
                          window.location.reload();
                        },
                        this.props.id
                      );
                    }
                  );
                } else {
                  saveTileGroupConfigs(
                    this.state.config,
                    !this.state.isEditMode,
                    () => {
                      this._closeDialog();
                      window.location.reload();
                    },
                    this.props.id
                  );
                }
              }}
              text="Save"
            />
            <DefaultButton onClick={this._closeDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
      </>
    );
  }
  private _showDialog = (isEditMode: boolean): void => {
    this.setState({
      hideDialog: false,
      isEditMode,
      config: isEditMode
        ? this.props
        : { id: "", width: 4, tileIds: [], name: "New Group" }
    });
  };

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  };
}
