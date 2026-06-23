/* eslint-disable */
/**
 * Generated stub — run `npx convex dev` to regenerate from your Convex project.
 */
import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as userState from "../userState.js";

declare const fullApi: ApiFromModules<{
  userState: typeof userState;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
