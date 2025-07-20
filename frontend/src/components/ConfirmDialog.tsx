"use client";

import { memo } from "react";
import { ResponsiveModal } from "./ResponsiveModal"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { DottedSeparator } from "./DottedSeparator";

type ConfirmModalProps = Omit<React.ComponentProps<typeof ResponsiveModal>, 'children'> & {
    title?: string;
    onClose?(): void;
    message?: string;
    cancelText?: string;
    onApprove?(): void;
    approveText?: string;
};

export const ConfirmDialog = memo((props: ConfirmModalProps) => {
    const {
        title = '',
        message = '',
        onClose,
        onApprove,
        cancelText = 'Cancel',
        approveText = 'Approve',
        ...restModalProps
    } = props;

    const showApproveButton = Boolean(approveText);

    return (
        <ResponsiveModal {...restModalProps}>
            <Card>
                <CardHeader className="p-4">
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <DottedSeparator />
                <CardContent className="px-4 py-6">
                    {message}
                </CardContent>
                <DottedSeparator />
                <CardFooter className="px-4 py-3 flex items-center justify-between gap-2">
                    {showApproveButton ? (
                        <>
                            <Button
                                variant="secondary"
                                onClick={onClose}
                            >
                                {cancelText}
                            </Button>
                            <Button variant="red" onClick={onApprove}>
                                {approveText}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={onClose}>
                            {cancelText}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </ResponsiveModal>
    )
});
