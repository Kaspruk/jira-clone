"use client";

import { useRouter, useParams } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { MdWorkspaces } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getWorkspaces, useWorkspaceModalState } from "@/features/workspaces";
import { useQuery } from "@tanstack/react-query";

export const WorkspaceSwitcher = () => {
    const router = useRouter();
    const params = useParams();
    const currentWorkspaceId = params.workspaceId as string;
    const [_, openWorspaceModal] = useWorkspaceModalState();

    const {data: workspaces} = useQuery(getWorkspaces)

    const onSelect = (id: string) => {
        router.push(`/${id}`);
    };

    const handleCreateWorkspace = () => {
        openWorspaceModal(0);
    };

    return (
        <div className="flex flex-col gap-y-3 mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MdWorkspaces className="size-4 text-neutral-600" />
                    <p className="text-xs font-semibold uppercase text-neutral-600 tracking-wider">
                        Workspace
                    </p>
                </div>
                <RiAddCircleFill
                    title="Створити новий workspace"
                    className="size-5 text-neutral-500 cursor-pointer hover:text-primary transition-colors" 
                    onClick={handleCreateWorkspace}
                />
            </div>
            
            <Select onValueChange={onSelect} value={currentWorkspaceId || ""}>
                <SelectTrigger className="w-full bg-neutral-50 hover:bg-neutral-100 border-neutral-200 font-medium h-auto p-1.5 transition-colors">
                    <SelectValue 
                        placeholder={
                            <div className="flex items-center gap-2 text-neutral-500">
                                <HiOutlineOfficeBuilding className="size-4" />
                                <span>Оберіть workspace</span>
                            </div>
                        }
                    />
                </SelectTrigger>
                <SelectContent className="w-full">
                    {workspaces?.map((workspace) => (
                        <SelectItem 
                            key={workspace.id} 
                            value={workspace.id.toString()}
                            className="cursor-pointer"
                        >
                            <div className="flex items-center p-1.5 gap-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded text-white text-xs flex items-center justify-center font-semibold">
                                    {workspace.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-medium text-sm">{workspace.name}</span>
                                    <span className="text-xs text-neutral-500">{workspace.description}</span>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
