import Link from "next/link";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                    Вхід в систему
                </h2>
                <p className="text-muted-foreground text-sm">
                    Введіть свої дані для входу
                </p>
            </div>

            <LoginForm />

            <div className="text-center">
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