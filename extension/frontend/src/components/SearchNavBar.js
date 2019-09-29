/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 */

import * as React from "react";
import styled, { keyframes } from "styled-components";

import { SCREENS } from "../data/screens";

import FlameIcon from "../icons/flame-icon";
import BackIcon from "../icons/back-icon";
import SearchIcon from "../icons/search-icon";

import {
  actionBackground,
  primaryText,
  flyoutBackground,
  pandaPink,
  defaultBackground,
  headerText,
  iconsActive,
  inputBorderColor,
  secondaryGray,
  pandaTeal
} from "../other/colors";

const StyledBackIcon = styled(BackIcon)`
  width: 20px;
  height: 20px;
`;

const BackIconButton = styled.button`
  font-weight: lighter;
  padding: 12px;
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  font-size: 14px;
  line-height: 14px;
  border: none;
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  margin: 0 6px 0 12px;
  pointer-events: all;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }

  &:hover {
    opacity: 0.6;
  }

  &:active {
    opacity: 0.8;
  }
`;

const TealSearchButton = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  margin: 8px;
  width: 48px;
  height: 48px;
  font-weight: lighter;
  text-decoration: none;
  color: ${flyoutBackground};
  background: ${pandaTeal};
  border-radius: 48px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  padding: 12px;
  pointer-events: all;

  &:focus {
    border-radius: 40px;
  }

  &:hover {
    transition: all 0.2s ease 0s;
    opacity: 0.7;
    color: rgb(254, 41, 92);
  }

  &:active {
    color: rgba(150, 150, 150, 1);
    opacity: 0.9;
    transition: all 0.2s ease 0s;
  }
`;

const Header = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  border-radius: 0;
  pointer-events: none;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const NavContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index:10;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const animateIn = keyframes`
  0% {
    opacity: 0;
  }

  25% {
    opacity: 0.2;
  }

  50% {
    opacity: 0.6;
  }

  75% {
    opacity: 0.9;
  }

  100% {
    opacity: 1;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  animation: ${animateIn} 0.4s 1;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const SearchForm = styled.form`
  display: flex;
  background-color: transparent;
  width: 80%;
  margin: 16px 20px 16px 10px;
  transition: 0.3s;
  box-shadow: none;
  pointer-events: all;
`;

const SearchBox = styled.input`
  position: relative;
  width: 100%;
  height: 48px;
  font-size: inherit;
  padding: 0 40px;
  appearance: none;
  border-radius: 12px;
  border: 2px solid ${inputBorderColor};
  caret-color: ${pandaTeal};
  font-size: 16px;
  pointer-events: all;

  &:focus {
    border-radius: 8px;
    border: 2px solid ${pandaTeal} !important;
    outline: 0 !important;
    box-shadow: none !important;
  }
`;

const SearchBlerpy = styled.img`
  border: none;
  position: absolute;
  top: 24px;
  height: 18px;
  width: 20px;
  padding: 8px 12px;
`;

class SearchNavBar extends React.Component {
  static defaultProps = {
    displayButtons: true,
    displayOnMobile: "logo",
    initialSearchQuery: ""
  };

  constructor(props) {
    super(props);
    this.state = {
      searchValue: props.initialSearchQuery,
      searchOpen: props.searchOpen || false
    };
  }

  componentDidMount() {}

  handleOpenSearch = () => {
    this.setState({ searchOpen: true }, () => {
      this.props.handleScreenChangeCallback(SCREENS.search, "");
      this.searchInput.focus();
    });
  };

  handleCloseSearch = () => {
    if (document) {
      document.body.scrollTop = 0;
    }
    this.setState({ searchOpen: false, searchValue: "" }, () => {
      this.props.handleScreenChangeCallback(SCREENS.popular, "");
    });
  };

  onHandleRef = input => {
    this.searchInput = input;
  };

  render() {
    return (
      <Header role="navigation">
        <NavContainer>
          {this.state.searchOpen ? (
            <SearchContainer>
              <BackIconButton onClick={this.handleCloseSearch}>
                <StyledBackIcon />
              </BackIconButton>
              <SearchForm
                type="search"
                onSubmit={
                  this.props.onSearchSubmit || this.defaultHandleSearchSubmit
                }
              >
                <SearchBox
                  type="search"
                  placeholder="Search blerp."
                  aria-label="Search"
                  value={this.state.searchValue}
                  onChange={
                    this.props.onSearchChange || this.defaultHandleSearchChange
                  }
                  innerRef={this.onHandleRef}
                />
                <SearchBlerpy src="https://storage.googleapis.com/blerp-main-bucket/images/BlipNew%403x.png" />
              </SearchForm>
            </SearchContainer>
          ) : (
            <SearchContainer>
              <TealSearchButton onClick={this.handleOpenSearch}>
                <SearchIcon />
              </TealSearchButton>
            </SearchContainer>
          )}
        </NavContainer>
      </Header>
    );
  }

  defaultHandleSearchSubmit = event => {
    event.preventDefault();
    if (!this.state.searchValue || this.state.searchValue === "") {
      return;
    }
    if (document) {
      document.body.scrollTop = 0;
    }
    this.props.handleScreenChangeCallback(SCREENS.search, this.state.searchValue);
  };

  defaultHandleSearchChange = event => {
    event.preventDefault();
    this.setState({
      searchValue: event.currentTarget.value
    });
  };
}

export default SearchNavBar;
