"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import * as motion from "motion/react-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useUser, useUpdateUser, useUploadAvatar } from "@/features/users/api";

export function UserAvatar() {
    const { data: user } = useUser();
    const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
    const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
    const [isEditing, setIsEditing] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

    // Оновлюємо локальний стан коли змінюється user
    React.useEffect(() => {
        if (user?.avatar) {
            setAvatarUrl(user.avatar);
        }
    }, [user?.avatar]);

    const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Перевіряємо тип файлу
            if (!file.type.startsWith('image/')) {
                toast.error("Файл повинен бути зображенням");
                return;
            }
            
            // Перевіряємо розмір файлу (максимум 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Розмір файлу не може перевищувати 5MB");
                return;
            }
            
            uploadAvatar(file, {
                onSuccess: () => {
                    toast.success("Аватар успішно оновлено");
                },
                onError: () => {
                    toast.error("Помилка при завантаженні аватара");
                }
            });
        }
    };

    const handleAvatarUrlChange = (url: string) => {
        setAvatarUrl(url);
    };

    const handleSaveAvatarUrl = () => {
        if (!avatarUrl.trim()) {
            toast.error("URL аватара не може бути порожнім");
            return;
        }

        // Валідація URL
        try {
            new URL(avatarUrl);
        } catch {
            toast.error("Введіть коректний URL зображення");
            return;
        }

        updateUser({ avatar: avatarUrl }, {
            onSuccess: () => {
                toast.success("Аватар успішно оновлено");
                setIsEditing(false);
            },
            onError: () => {
                toast.error("Помилка при оновленні аватара");
            }
        });
    };

    const handleCancelEdit = () => {
        setAvatarUrl(user?.avatar || "");
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon name="account_box" />
                    Фото профілю
                </CardTitle>
                <CardDescription>
                    Завантажте нове фото для свого профілю
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} alt={user.username} />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {getInitials(user.username)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                            {isUploadingAvatar ? (
                                <Icon name="loader" className="text-white text-xl animate-spin" />
                            ) : (
                                <Icon name="camera" className="text-white text-xl" />
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploadingAvatar}
                        />
                    </div>
                    
                    {isEditing ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full space-y-2"
                        >
                            <Input
                                placeholder="URL зображення"
                                value={avatarUrl}
                                onChange={(e) => handleAvatarUrlChange(e.target.value)}
                                className="text-center"
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                    className="flex-1"
                                >
                                    Скасувати
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSaveAvatarUrl}
                                    disabled={isUpdating}
                                    className="flex-1"
                                >
                                    {isUpdating ? "Збереження..." : "Зберегти"}
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Редагувати URL
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 