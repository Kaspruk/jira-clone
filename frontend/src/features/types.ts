export type WorkspaceType = {
  id: number;
  name: string;
  owner_id: number;
  description: string;
  created_at: number;
  updated_at: number;
};

export type ProjectDashboardData = {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  workspace_id: number;
  created_at: number;
  task_count: number;
};

export type WorkspaceDashboardData = {
  projects: ProjectDashboardData[];
};

export type ProjectType = {
  id: number;
  name: string;
  owner_id: number;
  description: string;
  workspace_id: number;
  types: TaskTypeType[];
  statuses: TaskStatusType[];
  priorities: TaskPriorityType[];
};

export type TaskType = {
  id: number;
  title: string;
  description: string;
  project_id: number;
  workspace_id: number;
  author_id: number;
  assignee_id: number;
  type_id?: TaskTypeType['id'];
  status_id?: TaskStatusType['id'];
  priority_id?: TaskPriorityType['id'];
  created_at: number;
  updated_at: number;
};

export type TaskStatusType = {
  id: number;
  icon: string;
  name: string;
  color: string;
  description: string;
  workspace_id: number;
};

export type WorkspaceTaskStatusType = TaskStatusType & {
  selected: boolean;
};

export type TaskPriorityType = {
  id: number;
  icon: string;
  name: string;
  color: string;
  description: string;
  workspace_id: number;
};

export type WorkspaceTaskPriorityType = TaskPriorityType & {
  selected: boolean;
};

export type TaskTypeType = {
  id: number;
  icon: string;
  name: string;
  color: string;
  description: string;
  workspace_id: number;
};

export type WorkspaceTaskTypeType = TaskTypeType & {
  selected: boolean;
};

export type TaskStatusRelationType = {
  id: number;
  order: number;
  project_id: number;
  task_status_id: number;
};

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
};

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGHT = "HIGHT",
};

export enum TypeTask {
  TASK = "TASK",
  HISTORY = "HISTORY",
  ISSUE = "ISSUE",
  EPIC = "EPIC",
  ENHANCEMENT = "ENHANCEMENT",
  DEFECT = "DEFECT",
};

export type UserType = {
  id: number;
  username: string;
  email: string;
  created_at: number;
};

export type DashboardWorkspaceType = WorkspaceType & {
  projects: ProjectType[];
  tasks: TaskType[];
};