import ConfigPage from "./pages/firstInteractionConfig";

import { renderPage } from "./index";

renderPage(ConfigPage, "root", { liveConfig: false }, { config: true});
