import { QuickPickItem } from "vscode";

export interface ISearchStoryQuickPick extends QuickPickItem {
  data: ISearchStory;
}

export interface IUserQuickPick extends QuickPickItem {
  data: IUser;
}

export interface IUser {
  role: string;
  profile: {
    mention_name: string;
  };
}

export interface ISearchStory {
  id: number;
  name: string;
  deadline: Date;
  moved_at: Date;
  epic_id: number;
  app_url: string;
  started: boolean;
  created_at: Date;
  blocker: boolean;
  estimate: number;
  blocked: boolean;
  position: number;
  started_at: Date;
  updated_at: Date;
  archived: boolean;
  project_id: number;
  story_type: string;
  completed: boolean;
  completed_at: Date;
  owner_ids: string[];
  description: string;
  external_id: string;
  entity_type: string;
  labels: ISearchStoryLabel[];
  mention_ids: string[];
  follower_ids: string[];
  requested_by_id: string;
  workflow_state_id: number;
  started_at_override: Date;
  story_links: ISearchStoryLink[];
  completed_at_override: Date;
}

export interface ISearchStoryStats {
  num_epics: number;
  num_points_total: number;
  num_stories_total: number;
  num_points_completed: number;
  num_stories_completed: number;
  num_points_in_progress: number;
  num_stories_in_progress: number;
  num_stories_unestimated: number;
}

export interface ISearchStoryLabel {
  id: number;
  name: string;
  color: string;
  created_at: Date;
  updated_at: Date;
  archived: boolean;
  stats: ISearchStoryStats;
  entity_type: string;
  external_id: string;
}

export interface ISearchStoryLink {
  id: number;
  type: string;
  verb: string;
  created_at: Date;
  updated_at: Date;
  object_id: number;
  subject_id: number;
  entity_type: string;
}

export interface IStoryPullRequest {
  branch_id: number;
  closed: boolean;
  created_at: Date;
  entity_type: string;
  id: number;
  num_added: number;
  num_commits: number;
  num_modified: number;
  num_removed: number;
  number: number;
  target_branch_id: number;
  title: string;
  updated_at: Date;
  url: string;
}

export interface IStoryBranch {
  created_at: Date;
  deleted: boolean;
  entity_type: string;
  id: number;
  merged_branch_ids: number[];
  name: string;
  persistent: boolean;
  pull_requests: IStoryPullRequest[];
  repository_id: number;
  updated_at: Date;
  url: string;
}

export interface IStoryComment {
  author_id: string;
  created_at: Date;
  entity_type: string;
  external_id: string;
  id: number;
  mention_ids: string[];
  position: number;
  story_id: number;
  text: string;
  updated_at: Date;
}

export interface IStoryAuthorIdentity {
  entity_type: string;
  name: string;
  type: string;
}

export interface IStoryCommit {
  author_email: string;
  author_id: string;
  author_identity: IStoryAuthorIdentity;
  created_at: Date;
  entity_type: string;
  hash: string;
  id: number;
  merged_branch_ids: number[];
  message: string;
  repository_id: number;
  timestamp: Date;
  updated_at: Date;
  url: string;
}

export interface IStoryFile {
  content_type: string;
  created_at: Date;
  description: string;
  entity_type: string;
  external_id: string;
  filename: string;
  id: number;
  mention_ids: string[];
  name: string;
  size: number;
  story_ids: number[];
  thumbnail_url: string;
  updated_at: Date;
  uploader_id: string;
  url: string;
}

export interface IStoryStats {
  num_epics: number;
  num_points_completed: number;
  num_points_in_progress: number;
  num_points_total: number;
  num_stories_completed: number;
  num_stories_in_progress: number;
  num_stories_total: number;
  num_stories_unestimated: number;
}

export interface IStoryLabel {
  archived: boolean;
  color: string;
  created_at: Date;
  entity_type: string;
  external_id: string;
  id: number;
  name: string;
  stats: IStoryStats;
  updated_at: Date;
}

export interface IStoryLinkedFile {
  content_type: string;
  created_at: Date;
  description: string;
  entity_type: string;
  id: number;
  mention_ids: string[];
  name: string;
  size: number;
  story_ids: number[];
  thumbnail_url: string;
  type: string;
  updated_at: Date;
  uploader_id: string;
  url: string;
}

export interface IStoryLink {
  created_at: Date;
  entity_type: string;
  id: number;
  object_id: number;
  subject_id: number;
  type: string;
  updated_at: Date;
  verb: string;
}

export interface IStoryTask {
  complete: boolean;
  completed_at: Date;
  created_at: Date;
  description: string;
  entity_type: string;
  external_id: string;
  id: number;
  mention_ids: string[];
  owner_ids: string[];
  position: number;
  story_id: number;
  updated_at: Date;
}

export interface IStory {
  app_url: string;
  archived: boolean;
  blocked: boolean;
  blocker: boolean;
  branches: IStoryBranch[];
  comments: IStoryComment[];
  commits: IStoryCommit[];
  completed: boolean;
  completed_at: Date;
  completed_at_override: Date;
  created_at: Date;
  deadline: Date;
  description: string;
  entity_type: string;
  epic_id: number;
  estimate: number;
  external_id: string;
  files: IStoryFile[];
  follower_ids: string[];
  id: number;
  labels: IStoryLabel[];
  linked_files: IStoryLinkedFile[];
  mention_ids: string[];
  moved_at: Date;
  name: string;
  owner_ids: string[];
  position: number;
  project_id: number;
  requested_by_id: string;
  started: boolean;
  started_at: Date;
  started_at_override: Date;
  story_links: IStoryLink[];
  story_type: string;
  tasks: IStoryTask[];
  updated_at: Date;
  workflow_state_id: number;
}

export interface IWorkflow {
  created_at: Date;
  default_state_id: number;
  description: string;
  entity_type: string;
  id: number;
  name: string;
  states: IWorkflowState[];
  team_id: number;
  updated_at: Date;
}

export interface IWorkflowState {
  color: string;
  created_at: Date;
  description: string;
  entity_type: string;
  id: number;
  name: string;
  num_stories: number;
  position: number;
  type: string;
  updated_at: Date;
  verb: string;
}
