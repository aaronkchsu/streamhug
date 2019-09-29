import * as React from "react";
import styled from "styled-components";
import PlusCornerButton from "../buttons/PlusCornerButton";

const StyledPlusIconButton = styled(PlusCornerButton)`
  position: absolute;
  bottom: 0;
  right: 0;
`;

class BlerpBlastAddButton extends React.Component {
  render() {
    return (
        <StyledPlusIconButton onClick={this.props.onClick}/>
    );
  }
}

export default BlerpBlastAddButton;
