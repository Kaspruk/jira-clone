"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { RegisterDataType } from "@/features/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRegister } from "../api";

type FormData = RegisterDataType & {
    confirmPassword: string;
}

export const RegisterForm = () => {
    const router = useRouter();
    const { control, handleSubmit, setError, formState: { errors } } = useForm<FormData>();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { mutate: register, isPending } = useRegister();

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Паролі не співпадають!"
            });
            return;
        }
        router.prefetch("/login");

        register(data, {
            onSuccess: () => {
                router.push("/login");
            },
            onError: (error) => {
                if (error.code === 2) {
                    setError("email", {
                        type: "manual",
                        message: error.message
                    });
                    return;
                }
            }
        });
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 animate-slide-up">
            <div className="space-y-3">
                <Label htmlFor="username" className="text-foreground font-medium">Ім'я користувача</Label>
                <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Ім'я користувача обов'язкове" }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            autoComplete="off"
                            placeholder="Введіть ім'я користувача"
                        />
                    )}
                />
                {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
            </div>

            <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Email обов'язковий" }}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                        />
                    )}
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            <div className="space-y-3">
                <Label htmlFor="password" className="text-foreground font-medium">Пароль</Label>
                <div className="relative">
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Пароль обов'язковий" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Створіть пароль"
                                className="pr-10"
                            />
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                        <Icon 
                            name={showPassword ? "visibility_off" : "visibility"} 
                            size={20}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        />
                    </button>
                </div>
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium">Підтвердження пароля</Label>
                <div className="relative">
                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{ required: "Підтвердження пароля обов'язкове" }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Підтвердіть пароль"
                                className="pr-10"
                            />
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                        <Icon 
                            name={showConfirmPassword ? "visibility_off" : "visibility"} 
                            size={20}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        />
                    </button>
                </div>
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
            </div>

            <Button 
                type="submit" 
                className="w-full"
                loading={isPending}
                disabled={isPending}
            >
                Зареєструватися
            </Button>
        </form>
    )
}