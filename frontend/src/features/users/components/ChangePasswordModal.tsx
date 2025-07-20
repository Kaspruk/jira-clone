"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/ui/error-message";
import { DottedSeparator } from "@/components/DottedSeparator";
import { ResponsiveModal, type ResponsiveModalProps } from "@/components/ResponsiveModal";
import { useChangePassword } from "../api";
import { useChangePasswordModalState } from "../hooks";

interface ChangePasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export function ChangePasswordModal() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
        watch,
        setError,
        clearErrors
    } = useForm<ChangePasswordFormData>({
        mode: "onChange",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const newPassword = watch("newPassword");

    const { mutate: changePassword, isPending } = useChangePassword();
    const [isOpen, setIsOpen] = useChangePasswordModalState();

    const handleClose = () => {
        reset();
        clearErrors();
        setIsOpen(false);
    };

    const onSubmit = (data: ChangePasswordFormData) => {
        if (data.newPassword !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match"
            });
            return;
        }

        changePassword(
            {
                current_password: data.currentPassword,
                new_password: data.newPassword
            },
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        );
    };

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <Card className="w-full p-4 h-full border-none shadow-none overflow-y-auto">
                <CardHeader className="flex mb-4">
                    <DialogTitle className="text-xl font-bold">
                        Change Password
                    </DialogTitle>
                </CardHeader>
                <div className="mb-4">
                    <DottedSeparator />
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                {...register("currentPassword", {
                                    required: { value: true, message: "Enter current password" },
                                    minLength: {
                                        value: 1,
                                        message: "Current password cannot be empty"
                                    }
                                })}
                                placeholder="Enter current password"
                            />
                            {errors.currentPassword && (
                                <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
                            )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...register("newPassword", {
                                    required: { value: true, message: "Enter new password" },
                                    minLength: {
                                        value: 6,
                                        message: "New password must contain at least 6 characters"
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*\d)/,
                                        message: "Password must contain letters and numbers"
                                    }
                                })}
                                placeholder="Enter new password"
                            />
                            {errors.newPassword && (
                                <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", {
                                    required: { value: true, message: "Confirm new password" },
                                    validate: (value) => {
                                        if (value !== newPassword) {
                                            return "Passwords do not match";
                                        }
                                        return true;
                                    }
                                })}
                                placeholder="Confirm new password"
                            />
                            {errors.confirmPassword && (
                                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                            )}
                        </div>
                        
                        <DottedSeparator className="my-4" />
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isPending}
                            >
                                {isPending ? "Changing password..." : "Change Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );
} 