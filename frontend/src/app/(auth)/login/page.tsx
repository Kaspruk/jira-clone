import Link from "next/link";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {

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

            <LoginForm />

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