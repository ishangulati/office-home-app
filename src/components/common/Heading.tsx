import { connect } from "react-redux";
import React from "react";
import { IState, Dispatch } from "../../redux/store";
import { toggleMode } from "../../redux/actions";

interface HeadingProps {
  readonly isEditMode: boolean;
  readonly toggleMode: () => void;
}

class Heading extends React.Component<HeadingProps> {
  render() {
    return (
      <div className="start-screen-title-container">
        <span className="start-screen-title">Office Home</span>
        <span
          className={`${
            this.props.isEditMode
              ? "mif-cancel fg-white"
              : "mif-pencil fg-white"
          }  mif-3x btn`}
          onClick={this.props.toggleMode}
        />
        {this.props.isEditMode && (
          <span
            className={"mif-layers-clear fg-red mif-3x btn  btn-danger"}
            onClick={() => {
              if (
                window.confirm(
                  "You are about to RESET all your tiles data. Continue?"
                )
              ) {
                localStorage.removeItem("groups");
                localStorage.removeItem("tiles");
                window.location.reload();
              }
            }}
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  isEditMode: state.isEditMode
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  toggleMode: () => dispatch(toggleMode())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Heading);
