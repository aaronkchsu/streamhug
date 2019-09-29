/*
 * BLERP LLC ("BLERP") CONFIDENTIAL
 * Copyright (c) 2018 Blerp LLC All Rights Reserved.
 * This file is subject to the terms and conditions defined in the file 'LICENSE',
 *   which is at the root directory of this source code repository.
 *
 * @flow
 */

import * as React from "react";
import styled from "styled-components";

const IconImage = styled.img`
  width: 80%;
  height: 80%;
  align-self: center;
  white-space: nowrap;
  opacity: 0.7;
`;

const NewStopIcon = () => (
  <IconImage src="https://storage.googleapis.com/blerp-public-images/interaction/StopSmall.svg" />
);

export default NewStopIcon;
