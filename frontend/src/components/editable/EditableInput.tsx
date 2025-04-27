import { KeyboardEvent, ChangeEvent } from "react";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useEditable, EditableProps } from "./utils";

export const EditableInput = ({
    value,
    onSave,
    className = '',
    placeholder = '',
    disabled = false,
}: EditableProps) => {
    const {
        isEditing,
        content,
        setContent,
        handleClick,
        handleSave,
        handleCancel,
        handleBlur,
    } = useEditable({ value, onSave, disabled });

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!isEditing) {
            if (e.key === 'Enter' || e.key === ' ') {
                handleClick();
            }
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.target.value);
    };

    return (
        <div className="w-full relative">
            <Input
                value={content}
                variant={isEditing ? 'default' : 'preview'}
                autoFocus={isEditing}
                className={cn(
                    "w-full",
                    !isEditing && "-ml-3 hover:ml-0 outline-none",
                    className
                )}
                placeholder={placeholder}
                onBlur={handleBlur}
                onClick={handleClick}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {isEditing && (
                <div className="absolute -bottom-9 right-0 flex space-x-2">
                    <Button
                        variant="secondary"
                        className="w-8 h-8 rounded"
                        onMouseDown={handleSave}
                    >
                        <FaCheck />
                    </Button>
                    <Button
                        variant="secondary"
                        className="w-8 h-8 rounded"
                        onMouseDown={handleCancel}
                    >
                        <FaTimes />
                    </Button>
                </div>
            )}
        </div>
    );
}; 