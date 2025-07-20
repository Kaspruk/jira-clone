'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { useUser, useUpdateUser } from '@/features/users/api';
import { toast } from 'sonner';
import * as motion from 'motion/react-client';

export function UserForm() {
  const { data: user } = useUser();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Валідація
    if (!formData.username.trim()) {
      toast.error("Ім'я користувача не може бути порожнім");
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email не може бути порожнім');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Введіть коректний email');
      return;
    }

    const updateData: any = {};

    if (formData.username !== user?.username) {
      updateData.username = formData.username;
    }

    if (formData.email !== user?.email) {
      updateData.email = formData.email;
    }

    if (Object.keys(updateData).length > 0) {
      updateUser(updateData, {
        onSuccess: () => {
          toast.success('Профіль успішно оновлено');
          setIsEditing(false);
        },
        onError: () => {
          toast.error('Помилка при оновленні профілю');
        },
      });
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <Card className="md:col-span-1 border-none shadow-none">
      <CardHeader className="sm:px-0 px-0">
        <CardTitle className="flex items-center gap-2">
          <Icon name="info" />
          Інформація профілю
        </CardTitle>
        <CardDescription>Основна інформація про ваш акаунт</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:px-0 px-0">
        <div className="space-y-2">
          <Label htmlFor="username">Ім'я користувача</Label>
          {isEditing ? (
            <Input
              value={formData.username}
              onChange={e => handleInputChange('username', e.target.value)}
              placeholder="Введіть ім'я користувача"
            />
          ) : (
            <div className="h-12 px-4 py-2 rounded-lg border border-border bg-background flex items-center">
              {formData.username}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder="Введіть email"
            />
          ) : (
            <div className="h-12 px-4 py-2 rounded-lg border border-border bg-background flex items-center">
              {formData.email}
            </div>
          )}
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end gap-3 pt-4"
          >
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm border border-border rounded hover:bg-muted transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Збереження...' : 'Зберегти'}
            </button>
          </motion.div>
        )}

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Редагувати інформацію
          </button>
        )}
      </CardContent>
    </Card>
  );
}
