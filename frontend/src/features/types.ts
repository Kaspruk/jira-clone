export type WorkspaceType = {
  id: number;
  name: string;
  description: string;
  created_at: number;
  updated_at: number;
};

export type ProjectType = {
  id: number;
  name: string;
  owner_id: number;
  description: string;
  workspace_id: number;
  statuses: TaskStatusType[];
  priorities: TaskPriorityType[];
};

export type TaskType = {
  id: number;
  title: string;
  description: string;
  type: TypeTask;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: number;
  author_id: number;
  assignee_id: number;
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
