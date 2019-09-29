/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2016 - 2017 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 *
 * @flow
 */

import * as React from "react";
import styled from "styled-components";
import Loading from "./LoadingAnimation";

const LoadingContainer = styled.div`
  padding: 10px;
  height: 640px;

  @media (max-width: 600px) {
    padding: 10px;
    height: 400px;
  }
`;

const isBrowser = typeof window !== "undefined";

const LoadingFullScreen = () => (
  <LoadingContainer>
    <Loading isMobile={isBrowser ? window.innerWidth < 600 : false} />
  </LoadingContainer>
);

export default LoadingFullScreen;
