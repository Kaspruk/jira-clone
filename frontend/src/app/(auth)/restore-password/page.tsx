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
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
                        <Icon name="check_circle" size={32} className="text-green-600" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                        Перевірте свою пошту
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Ми відправили інструкції для відновлення пароля на{" "}
                        <span className="font-medium text-foreground">{email}</span>
                    </p>
                </div>

                <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
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
                        className="text-primary hover:underline text-sm font-medium transition-colors"
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
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                        <Icon name="lock_reset" size={24} className="text-primary" />
                    </div>
                </div>
                
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Відновлення пароля
                </h2>
                <p className="text-muted-foreground text-sm">
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
                    className="text-primary hover:underline text-sm font-medium transition-colors"
                >
                    ← Повернутися до входу
                </Link>
            </div>

            <div className="text-center pt-4 border-t border-border">
                <span className="text-muted-foreground text-sm">
                    Немає акаунту?{" "}
                    <Link 
                        href="/register"
                        className="text-primary hover:underline font-medium transition-colors"
                    >
                        Зареєструватися
                    </Link>
                </span>
            </div>
        </div>
    );
} 