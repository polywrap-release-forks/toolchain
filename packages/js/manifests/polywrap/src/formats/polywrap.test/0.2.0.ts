/* eslint-disable @typescript-eslint/naming-convention */
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface PolywrapWorkflow {
  /**
   * Workflow format version
   */
  format: "0.2.0";
  /**
   * Workflow name
   */
  name: string;
  /**
   * Path to validation script
   */
  validation?: string;
  jobs: Jobs;
  __type: "PolywrapWorkflow";
}
/**
 * Map of workflow jobs
 */
export interface Jobs {
  [k: string]: JobInfo;
}
/**
 * Sequences of actions inside the job
 *
 * This interface was referenced by `Jobs`'s JSON-Schema definition
 * via the `patternProperty` "^.*$".
 */
export interface JobInfo {
  /**
   * Array of calls to wrappers
   */
  steps?: Step[];
  jobs?: Jobs;
}
export interface Step {
  /**
   * Wrapper URI
   */
  uri: any;
  /**
   * Wrapper method name
   */
  method: string;
  /**
   * Wrapper method arguments
   */
  args?: {
    [k: string]: unknown;
  };
  /**
   * Path to a client config file.
   */
  config?: string;
}
