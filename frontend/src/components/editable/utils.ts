import { useEffect, useRef, useState } from "react";

export interface EditableProps {
    value: string;
    onSave: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export const useEditable = ({ value, onSave, disabled }: EditableProps) => {
    const isCancelClicked = useRef(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(value);

    useEffect(() => {
        setContent(value);
    }, [value]);

    const handleClick = () => {
        if (!disabled) {
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        if (content.trim()) {
            onSave(content);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        isCancelClicked.current = true;
        setContent(value);
        setIsEditing(false);
    };

    const handleBlur = () => {
        const timeout = setTimeout(() => {
            if (!isCancelClicked.current) {
                handleSave();
            }
            isCancelClicked.current = false;
            clearTimeout(timeout);
        }, 100);
    };

    return {
        content,
        isEditing,
        setContent,
        handleClick,
        handleSave,
        handleCancel,
        handleBlur,
    };
};
