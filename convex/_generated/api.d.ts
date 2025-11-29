/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as movieLists from "../movieLists.js";
import type * as movies from "../movies.js";
import type * as native_apple from "../native_apple.js";
import type * as node from "../node.js";
import type * as router from "../router.js";
import type * as user from "../user.js";
import type * as verify from "../verify.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  http: typeof http;
  movieLists: typeof movieLists;
  movies: typeof movies;
  native_apple: typeof native_apple;
  node: typeof node;
  router: typeof router;
  user: typeof user;
  verify: typeof verify;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
