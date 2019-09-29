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
import ScrollArrowIcon from "../icons/scroll-arrow-icon";

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

const StyledFlameIcon = styled(FlameIcon)`
  width: 32px;
  height: 32px;
`;

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

const IconButton = styled.button`
  margin: 8px;
  font-weight: lighter;
  padding: 12px 20px;
  text-decoration: none;
  white-space: nowrap;
  background: transparent;
  border-radius: 40px;
  margin-left: 8px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  opacity: 1;

  &:focus {
    border-radius: 40px;
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
    border: 2px solid #21CFA7 !important;
    outline: 0 !important;
    box-shadow: none !important;
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

const ScrollButton = styled.button`
  width: 48px;
  height: 48px;
  font-weight: lighter;
  text-decoration: none;
  color: ${flyoutBackground};
  background: ${pandaPink};
  margin: 4px;
  border-radius: 48px;
  font-size: 14px;
  line-height: 14px;
  border: none;
  padding: 12px;
  pointer-events: all;

  &:focus {
    border: 2px solid #21CFA7 !important;
    outline: 0 !important;
    box-shadow: none !important;
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
  position: sticky;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  z-index: 10000;
  border-radius: 0;
  pointer-events: none;

  @media (min-width: 600px) {
    justify-content: center;
  }
`;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

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

const ScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  animation: ${animateIn} 0.4s 1;
  margin: 8px;
  margin-bottom: 0;

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
  bottom: 22px;
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

  componentWillReceiveProps(newProps) {
    if (newProps.searchOpen) {
      this.setState({ searchOpen: true });
    }
  }

  componentDidMount() {}

  handleOpenSearch = () => {
    this.setState({ searchOpen: true }, () => {
      this.props.handleScreenChangeCallback(SCREENS.search);
      this.searchInput.focus();
    });
  };

  scrollDown = () => {
    window.scrollBy(0, 200);
  };

  scrollUp = () => {
    window.scrollBy(0, -200);
  };

  handleCloseSearch = () => {
    if (document) {
      document.body.scrollTop = 0;
    }
    this.setState({ searchOpen: false, searchValue: "" }, () => {
      this.props.handleQueryChangeCallback("");
      this.props.handleScreenChangeCallback(SCREENS.popular);
    });
  };

  handleScreenChangeCallback = () => {
    this.props.handleScreenChangeCallback(SCREENS.popular);
  };

  onHandleRef = input => {
    this.searchInput = input;
  };

  render() {
    return (
      <Header role="navigation">
        <ScrollContainer>
          <ScrollButton onClick={this.scrollUp}>
            <ScrollArrowIcon up={true} />
          </ScrollButton>
          <ScrollButton onClick={this.scrollDown}>
            <ScrollArrowIcon up={false} />
          </ScrollButton>
        </ScrollContainer>
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
                <SearchBlerpy src="https://storage.googleapis.com/blerp-web-images/main/blerpy-gray-search.png" />
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
    this.props.handleQueryChangeCallback(this.state.searchValue);
    const searchValue = this.state.searchValue.split(" ").join("-");
  };

  defaultHandleSearchChange = event => {
    event.preventDefault();
    this.setState({
      searchValue: event.currentTarget.value
    });
  };
}

export default SearchNavBar;
