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
  width: 100%;
  height: 100%;
  align-self: center;
  white-space: nowrap;
  min-width: 12px;
  min-height: 12px;
`;

const TealCheckIcon = props => (
  <IconImage
    className={props.className}
    src="https://storage.googleapis.com/blerp-public-images/interaction/teal_checkmark_stuff.svg"
  />
);

export default TealCheckIcon;
