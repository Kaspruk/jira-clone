"use client";

interface HtmlOutputProps {
    className?: string;
    children: string;
}

export const HtmlOutput = ({ className = "", children }: HtmlOutputProps) => {
    return (
        <div 
            className={className}
            dangerouslySetInnerHTML={{ __html: children }}
        />
    );
}; 