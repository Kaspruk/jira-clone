"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { useLogin } from "@/features/auth/api";
import { LoginDataType } from "@/features/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { ErrorMessage } from "@/components/ui/error-message";

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    
    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginDataType>({
        defaultValues: {
            email: "andrii@example.com",
            password: "123456",
        },
    });

    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data: LoginDataType) => {
        login(data, {
            onSuccess: () => {
                router.push("/");
            },
            onError: (error: any) => {
                if (error.code === 4) {
                    setError("password", { message: error.message });
                } else if (error.code === 3) {
                    setError("email", { message: error.message });
                } else if (error.code === 2) {
                    setError("root", { message: error?.message || "Помилка входу в систему" });
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-slide-up">
            <div className="space-y-3">
                <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "Email є обов'язковим",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Невірний формат email"
                        }
                    }}
                    render={({ field }) => (
                        <Input
                            id="email"
                            placeholder="your@email.com"
                            error={!!errors.email}
                            {...field}
                        />
                    )}
                />
                {errors.email && (
                    <ErrorMessage className="text-error">{errors.email.message}</ErrorMessage>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="password" className="text-foreground font-medium">Пароль</Label>
                <div className="relative">
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: "Пароль є обов'язковим",
                            minLength: {
                                value: 6,
                                message: "Пароль повинен містити мінімум 6 символів"
                            }
                        }}
                        render={({ field }) => (
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                error={!!errors.password}
                                placeholder="Введіть пароль"
                                {...field}
                                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                            />
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        tabIndex={-1}
                    >
                        <Icon 
                            name={showPassword ? "visibility_off" : "visibility"} 
                            size={20}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        />
                    </button>
                </div>
                {errors.password && (
                    <ErrorMessage className="text-error">{errors.password.message}</ErrorMessage>
                )}
            </div>

            <div className="flex items-center justify-between">
                <Link 
                    href="/restore-password"
                    className="text-sm text-primary hover:underline font-medium transition-colors"
                >
                    Забули пароль?
                </Link>
            </div>

            {errors.root && (
                <div className="text-center p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <ErrorMessage className="text-destructive text-sm">{errors.root.message}</ErrorMessage>
                </div>
            )}

            <Button 
                type="submit" 
                className="w-full"
                loading={isPending}
                disabled={isPending}
            >
                Увійти
            </Button>
        </form>
    )
}