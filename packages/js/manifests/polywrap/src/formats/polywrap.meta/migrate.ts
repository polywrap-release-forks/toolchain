/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/migrate-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/migrate-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */
import {
  AnyMetaManifest,
  MetaManifest,
  MetaManifestFormats,
} from ".";
import { findShortestMigrationPath } from "../../migrations";
import { migrators } from "./migrators";
import { ILogger } from "@polywrap/logging-js";

export function migrateMetaManifest(
  manifest: AnyMetaManifest,
  to: MetaManifestFormats,
  logger?: ILogger
): MetaManifest {
  let from = manifest.format as MetaManifestFormats;

  if (!(Object.values(MetaManifestFormats).some(x => x === from))) {
    throw new Error(`Unrecognized MetaManifestFormat "${manifest.format}"`);
  }

  if (!(Object.values(MetaManifestFormats).some(x => x === to))) {
    throw new Error(`Unrecognized MetaManifestFormat "${to}"`);
  }

  const migrationPath = findShortestMigrationPath(migrators, from, to);
  if (!migrationPath) {
    throw new Error(
      `Migration path from MetaManifestFormat "${from}" to "${to}" is not available`
    );
  }

  let newManifest = manifest;

  for(const migrator of migrationPath){
    newManifest = migrator.migrate(newManifest, logger) as AnyMetaManifest;
  }

  return newManifest as MetaManifest;
}
