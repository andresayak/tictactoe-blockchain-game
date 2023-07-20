import {IndexPage} from "../pages/IndexPage";
import { ExplorePage } from "../pages/ExplorePage";
import { GamePage } from "../pages/GamePage";
export const indexRoutes = {
  path: "/",
  exact: true,
  component: IndexPage
};

export const exploreRoutes = {
  path: "/explore",
  exact: true,
  component: ExplorePage
};

export const gameRoutes = {
  path: "/game/:gameAddress",
  exact: true,
  component: GamePage
};


export const page = [
  indexRoutes,
  exploreRoutes,
  gameRoutes
];

export default [...page];
