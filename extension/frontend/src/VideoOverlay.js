import React from "react";
import ReactDOM from "react-dom";
import OverlayPage from "./pages/overlay";

import { renderPage } from "./index";

renderPage(OverlayPage, "root", { giant: false });
