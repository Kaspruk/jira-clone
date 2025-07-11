"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function RestorePasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    if (submitted) {
        return (
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon name="check_circle" size={32} className="text-green-600" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        Перевірте свою пошту
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Ми відправили інструкції для відновлення пароля на{" "}
                        <span className="font-medium">{email}</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-gray-500 text-sm">
                        Не отримали лист? Перевірте папку "Спам" або
                    </p>
                    
                    <Button 
                        variant="outline"
                        onClick={() => {
                            setSubmitted(false);
                            setEmail("");
                        }}
                        className="w-full"
                    >
                        Спробувати ще раз
                    </Button>
                </div>

                <div className="text-center">
                    <Link 
                        href="/login"
                        className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                        ← Повернутися до входу
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="lock_reset" size={24} className="text-blue-600" />
                    </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Відновлення пароля
                </h2>
                <p className="text-gray-600 text-sm">
                    Введіть свій email і ми надішлемо інструкції для відновлення пароля
                </p>
            </div>

            {/* <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email адреса</Label>
                    <Input
                        id="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                >
                    Відправити інструкції
                </Button>
            </form> */}

            <div className="text-center">
                <Link 
                    href="/login"
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                    ← Повернутися до входу
                </Link>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
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