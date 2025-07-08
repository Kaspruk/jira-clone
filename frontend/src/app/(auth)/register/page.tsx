import Link from "next/link";
import { RegisterForm } from "@/features/auth";

export default function RegisterPage() {
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

            <RegisterForm />

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