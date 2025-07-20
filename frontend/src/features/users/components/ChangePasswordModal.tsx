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
                message: "Паролі не співпадають"
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
                        Зміна пароля
                    </DialogTitle>
                </CardHeader>
                <div className="mb-4">
                    <DottedSeparator />
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="currentPassword">Поточний пароль</Label>
                            <Input
                                id="currentPassword"
                                type="password"
                                {...register("currentPassword", {
                                    required: { value: true, message: "Введіть поточний пароль" },
                                    minLength: {
                                        value: 1,
                                        message: "Поточний пароль не може бути порожнім"
                                    }
                                })}
                                placeholder="Введіть поточний пароль"
                            />
                            {errors.currentPassword && (
                                <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
                            )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="newPassword">Новий пароль</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...register("newPassword", {
                                    required: { value: true, message: "Введіть новий пароль" },
                                    minLength: {
                                        value: 6,
                                        message: "Новий пароль повинен містити мінімум 6 символів"
                                    },
                                    pattern: {
                                        value: /^(?=.*[a-zA-Z])(?=.*\d)/,
                                        message: "Пароль повинен містити літери та цифри"
                                    }
                                })}
                                placeholder="Введіть новий пароль"
                            />
                            {errors.newPassword && (
                                <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
                            )}
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Підтвердіть новий пароль</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword", {
                                    required: { value: true, message: "Підтвердіть новий пароль" },
                                    validate: (value) => {
                                        if (value !== newPassword) {
                                            return "Паролі не співпадають";
                                        }
                                        return true;
                                    }
                                })}
                                placeholder="Підтвердіть новий пароль"
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
                                Скасувати
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isPending}
                            >
                                {isPending ? "Зміна пароля..." : "Змінити пароль"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </ResponsiveModal>
    );
} 