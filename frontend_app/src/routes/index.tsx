import {IndexPage} from "../pages/IndexPage";
import { ExplorePage } from "../pages/ExplorePage";
import { GamePage } from "../pages/GamePage";
import { TermsPage } from "../pages/TermsPage";
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

export const myRoutes = {
  path: "/my",
  exact: true,
  component: ExplorePage
};

export const gameRoutes = {
  path: "/game/:gameAddress",
  exact: true,
  component: GamePage
};

export const termsRoutes = {
  path: "/terms",
  exact: true,
  component: TermsPage
};

export const page = [
  indexRoutes,
  termsRoutes,
  myRoutes,
  exploreRoutes,
  gameRoutes
];

export default [...page];
