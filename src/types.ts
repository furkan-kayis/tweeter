import { FILTERS, ROUTES } from "./constants";

export type Route = (typeof ROUTES)[number];
export type Filter = (typeof FILTERS)[number];
