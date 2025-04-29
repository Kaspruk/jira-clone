import { TypeTask } from "@/features/types";
import { 
    FaBookmark, 
    FaCheckSquare 
} from "react-icons/fa";
import { PiPlusFill, PiLightningFill, PiDotOutlineFill  } from "react-icons/pi";
import { LiaDotCircle } from "react-icons/lia";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const QueriesKeys = {
    Projects: 'projects',
    Project: 'project',
    Tasks: 'tasks',
    Task: 'task',
    Users: 'users',
    User: 'user',
    WorkspaceStatuses: 'workspaceStatuses',
};

export const TaskTypeData = {
    [TypeTask.TASK]: {
        title: 'Task',
        icon: FaCheckSquare,
        color: '#38bdf8',
    },
    [TypeTask.HISTORY]: {
        title: 'History',
        icon: FaBookmark,
        color: '#d9f99d',
    },
    [TypeTask.ISSUE]: {
        title: 'Issue',
        icon: PiDotOutlineFill,
        color: '#f43f5e',
    },
    [TypeTask.EPIC]: {
        title: 'Epic',
        icon: PiLightningFill,
        color: '#818cf8',
    },
    [TypeTask.ENHANCEMENT]: {
        title: 'Ehnancment',
        icon: PiPlusFill,
        color: '#a7f3d0',
    },
    [TypeTask.DEFECT]: {
        title: 'Defect',
        icon: LiaDotCircle,
        color: '#f43f5e',
    },
}