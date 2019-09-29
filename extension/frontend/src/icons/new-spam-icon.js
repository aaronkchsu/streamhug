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
  width: 120%;
  height: 120%;
  align-self: center;
  white-space: nowrap;
  opacity: 0.7;
`;

const NewSpamIcon = () => (
  <IconImage src="https://storage.googleapis.com/blerp-web-images/static/audio-icon/new-spam.svg" />
);

export default NewSpamIcon;
