/* eslint-disable */
/**
 * This file was automatically generated by scripts/manifest/validate-ts.mustache.
 * DO NOT MODIFY IT BY HAND. Instead, modify scripts/manifest/validate-ts.mustache,
 * and run node ./scripts/manifest/generateFormatTypes.js to regenerate this file.
 */
import {
  AnyMetaManifest,
  MetaManifestFormats
} from ".";

import MetaManifestSchema_0_1 from "@polywrap/polywrap-manifest-schemas/formats/polywrap.meta/0.1.json";

import {
  Schema,
  Validator,
  ValidationError,
  ValidatorResult
} from "jsonschema";

type MetaManifestSchemas = {
  [key in MetaManifestFormats]: Schema | undefined
};

const schemas: MetaManifestSchemas = {
  // NOTE: Patch fix for backwards compatability
  "0.1.0": MetaManifestSchema_0_1,
  "0.1": MetaManifestSchema_0_1,
};

const validator = new Validator();


export function validateMetaManifest(
  manifest: AnyMetaManifest,
  extSchema: Schema | undefined = undefined
): void {
  const schema = schemas[manifest.format as MetaManifestFormats];

  if (!schema) {
    throw Error(`Unrecognized MetaManifest schema format "${manifest.format}"\nmanifest: ${JSON.stringify(manifest, null, 2)}`);
  }

  const throwIfErrors = (result: ValidatorResult) => {
    if (result.errors.length) {
      throw new Error([
        `Validation errors encountered while sanitizing MetaManifest format ${manifest.format}`,
        ...result.errors.map((error: ValidationError) => error.toString())
      ].join("\n"));
    }
  };

  throwIfErrors(validator.validate(manifest, schema));

  if (extSchema) {
    throwIfErrors(validator.validate(manifest, extSchema));
  }
}
