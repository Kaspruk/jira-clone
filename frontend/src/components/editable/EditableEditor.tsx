import { cn } from "@/lib/utils";
import Editor from "../editor";
import { Button } from "../ui/button";
import { EditableProps, useEditable } from "./utils";

export const EditableEditor = ({
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
    } = useEditable({ value, onSave, disabled });

    const handleChange = (newContent: string) => {
        setContent(newContent);
    };

    return (
        <div className="w-full">
            {isEditing ? (
                <div className={cn("w-full", className)}>
                    <Editor
                        onChange={handleChange}
                        placeholder={placeholder}
                        defaultValue={value}
                    />
                    <div className="mt-2 flex justify-start space-x-2">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    className={cn(
                        "cursor-pointer hover:bg-gray-100 p-2 -ml-2 hover:ml-0 rounded-md transition-all",
                        className
                    )}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleClick();
                        }
                    }}
                    dangerouslySetInnerHTML={{ __html: content || placeholder }}
                />
            )}
        </div>
    );
}; 