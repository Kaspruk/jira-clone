import Link from "next/link";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Створити акаунт
                </h2>
                <p className="text-muted-foreground text-sm">
                    Заповніть форму для реєстрації
                </p>
            </div>

            <RegisterForm />

            <div className="text-center">
                <span className="text-muted-foreground text-sm">
                    Вже маєте акаунт?{" "}
                    <Link 
                        href="/login"
                        className="text-primary hover:underline font-medium transition-colors"
                    >
                        Увійти
                    </Link>
                </span>
            </div>
        </div>
    );
} 