/* eslint-disable */
/**
 * Generated stub — run `npx convex dev` to regenerate from your Convex project.
 */
import type { DataModelFromSchemaDefinition } from "convex/server";
import type schema from "../schema.js";

type Schema = typeof schema;
export type DataModel = DataModelFromSchemaDefinition<Schema>;

export type Doc<TableName extends keyof DataModel> = DataModel[TableName]["document"];
export type Id<TableName extends keyof DataModel> = DataModel[TableName]["document"]["_id"];
