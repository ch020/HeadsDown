import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import NewPack from "./pages/NewPack";
import Lobby from "./pages/Lobby";
import Play from "./pages/Play";
import Summary from "./pages/Summary";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "new-pack", element: <NewPack /> },
            { path: "lobby", element: <Lobby /> },
            { path: "play", element: <Play /> },
            { path: "summary", element: <Summary /> },
            { path: "settings", element: <Settings /> },
        ]
    }
]);

export default router;
