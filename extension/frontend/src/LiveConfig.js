import ConfigPage from "./pages/config";

import { renderPage } from "./index";

renderPage(ConfigPage, "root", { liveConfig: true }, { config: true });
