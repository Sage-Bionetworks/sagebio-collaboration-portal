/**
 * A dataset resource.
 * https://docs.ckan.org/en/2.8/api/index.html?highlight=resource_type#ckan.logic.action.create.resource_create
 */

// @flow
export interface CkanDatasetResource {
  mimetype?: string;
  cache_url?: string;
  hash?: string;
  description?: string;
  name?: string;
  format?: string;
  url: string;
  cache_last_updated?: string;  // iso date string
  package_id: string;
  created?: string;  // iso date string
  state?: string;
  mimetype_inner?: string;
  last_modified?: string;  // iso date string
  position: number;
  revision_id?: string;
  url_type: string;
  id: string;
  resource_type?: string;
  size?: number;
}
