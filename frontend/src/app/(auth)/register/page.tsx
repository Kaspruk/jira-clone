"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Паролі не співпадають!");
            return;
        }

        setLoading(true);
        
        // TODO: Додати логіку реєстрації
        console.log("Дані для реєстрації:", formData);
        
        // Симулюємо запит
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Створити акаунт
                </h2>
                <p className="text-gray-600 text-sm">
                    Заповніть форму для реєстрації
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Ім'я користувача</Label>
                                         <Input
                         id="username"
                         placeholder="Введіть ім'я користувача"
                        value={formData.username}
                        onChange={handleChange("username")}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                                         <Input
                         id="email"
                         placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange("email")}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                                                 <Input
                             id="password"
                             placeholder="Створіть пароль"
                            value={formData.password}
                            onChange={handleChange("password")}
                            required
                            className="pr-10"
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
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Підтвердження пароля</Label>
                    <div className="relative">
                                                 <Input
                             id="confirmPassword"
                             placeholder="Підтвердіть пароль"
                            value={formData.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            <Icon 
                                name={showConfirmPassword ? "visibility_off" : "visibility"} 
                                size={20}
                                className="text-gray-400 hover:text-gray-600"
                            />
                        </button>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                >
                    Зареєструватися
                </Button>
            </form>

            <div className="text-center">
                <span className="text-gray-600 text-sm">
                    Вже маєте акаунт?{" "}
                    <Link 
                        href="/login"
                        className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                        Увійти
                    </Link>
                </span>
            </div>
        </div>
    );
} 