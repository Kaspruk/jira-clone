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

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    
    // React Hook Form
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

    // API hook для логіну
    const { mutate: login, isPending } = useLogin();

    const onSubmit = (data: LoginDataType) => {
        login(data, {
            onSuccess: (data) => {
                console.log(data);
                router.push("/");
            },
            onError: (error: any) => {
                // Показуємо помилку в формі
                setError("root", {
                    message: error?.message || "Помилка входу в систему"
                });
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Вхід в систему
                </h2>
                <p className="text-gray-600 text-sm">
                    Введіть свої дані для входу
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
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
                        <ErrorMessage>{errors.email.message}</ErrorMessage>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
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
                        >
                            <Icon 
                                name={showPassword ? "visibility_off" : "visibility"} 
                                size={20}
                                className="text-gray-400 hover:text-gray-600"
                            />
                        </button>
                    </div>
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <Link 
                        href="/restore-password"
                        className="text-sm text-blue-600 hover:text-blue-500"
                    >
                        Забули пароль?
                    </Link>
                </div>

                {errors.root && (
                    <div className="text-center p-2 bg-red-50 rounded">
                        <ErrorMessage>{errors.root.message}</ErrorMessage>
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

            <div className="text-center">
                <span className="text-gray-600 text-sm">
                    Немає акаунту?{" "}
                    <Link 
                        href="/register"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Зареєструватися
                    </Link>
                </span>
            </div>
        </div>
    );
} 