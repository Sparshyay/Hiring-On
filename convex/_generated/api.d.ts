/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin_requests from "../admin_requests.js";
import type * as admins from "../admins.js";
import type * as ai from "../ai.js";
import type * as analytics from "../analytics.js";
import type * as applications from "../applications.js";
import type * as auth from "../auth.js";
import type * as blogs from "../blogs.js";
import type * as companies from "../companies.js";
import type * as data_react_questions from "../data/react_questions.js";
import type * as data_standard_topics from "../data/standard_topics.js";
import type * as debug_tests from "../debug_tests.js";
import type * as debug_utils from "../debug_utils.js";
import type * as files from "../files.js";
import type * as fix_data from "../fix_data.js";
import type * as internships from "../internships.js";
import type * as jobs from "../jobs.js";
import type * as jobs_mutations from "../jobs_mutations.js";
import type * as master_data from "../master_data.js";
import type * as migrations from "../migrations.js";
import type * as notifications from "../notifications.js";
import type * as recruiters from "../recruiters.js";
import type * as reset_sparsh from "../reset_sparsh.js";
import type * as scripts from "../scripts.js";
import type * as search from "../search.js";
import type * as seed from "../seed.js";
import type * as seed_colleges from "../seed_colleges.js";
import type * as seed_force from "../seed_force.js";
import type * as seed_master_data from "../seed_master_data.js";
import type * as seed_tests from "../seed_tests.js";
import type * as tests from "../tests.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin_requests: typeof admin_requests;
  admins: typeof admins;
  ai: typeof ai;
  analytics: typeof analytics;
  applications: typeof applications;
  auth: typeof auth;
  blogs: typeof blogs;
  companies: typeof companies;
  "data/react_questions": typeof data_react_questions;
  "data/standard_topics": typeof data_standard_topics;
  debug_tests: typeof debug_tests;
  debug_utils: typeof debug_utils;
  files: typeof files;
  fix_data: typeof fix_data;
  internships: typeof internships;
  jobs: typeof jobs;
  jobs_mutations: typeof jobs_mutations;
  master_data: typeof master_data;
  migrations: typeof migrations;
  notifications: typeof notifications;
  recruiters: typeof recruiters;
  reset_sparsh: typeof reset_sparsh;
  scripts: typeof scripts;
  search: typeof search;
  seed: typeof seed;
  seed_colleges: typeof seed_colleges;
  seed_force: typeof seed_force;
  seed_master_data: typeof seed_master_data;
  seed_tests: typeof seed_tests;
  tests: typeof tests;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
