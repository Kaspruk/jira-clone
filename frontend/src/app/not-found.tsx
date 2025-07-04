import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Іконка помилки */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <Icon name="error_outline" size={48} className="text-red-600" />
                        </div>
                    </div>

                    {/* Заголовок */}
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    
                    {/* Опис */}
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Сторінку не знайдено
                    </h2>
                    
                    <p className="text-gray-600 mb-8">
                        На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
                    </p>

                    {/* Кнопки навігації */}
                    <div className="space-y-3">
                        <Link href="/" className="block">
                            <Button className="w-full">
                                <Icon name="home" size={16} className="mr-2" />
                                Повернутися на головну
                            </Button>
                        </Link>
                        
                        <Button 
                            variant="outline" 
                            className="w-full"
                        >
                            <Icon name="arrow_back" size={16} className="mr-2" />
                            Повернутися назад
                        </Button>
                    </div>

                    {/* Додаткова інформація */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-4">
                            Можливо, вас зацікавить:
                        </p>
                        
                        <div className="flex flex-col space-y-2">
                            <Link 
                                href="/login" 
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                                Увійти в систему
                            </Link>
                            <Link 
                                href="/register" 
                                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                            >
                                Створити акаунт
                            </Link>
                        </div>
                    </div>

                    {/* Логотип */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-center space-x-2">
                            <Icon name="task" size={20} className="text-blue-600" />
                            <span className="text-lg font-bold text-gray-900">Jira Clone</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Керуйте своїми проєктами ефективно
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 