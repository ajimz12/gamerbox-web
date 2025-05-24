export * from './auth';
export * from './profile';
export * from './reviews';
export * from './lists';
export * from './favorites';
export * from './comments';
export * from './users';

import * as auth from './auth';
import * as profile from './profile';
import * as reviews from './reviews';
import * as lists from './lists';
import * as favorites from './favorites';
import * as comments from './comments';
import * as users from './users';

export default {
  ...auth,
  ...profile,
  ...reviews,
  ...lists,
  ...favorites,
  ...comments,
  ...users,
};