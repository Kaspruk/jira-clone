'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePasswordModalState } from '@/features/users/hooks';
import { useUser } from '../api';
import { useLogout } from '@/features/auth/api';
import { useRouter } from 'next/navigation';

export function UserStatus() {
  const { data: user } = useUser();
  const [_, setIsPasswordModalOpen] = useChangePasswordModalState();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    logout(undefined, {
      onSuccess: () => {
        router.push('/login');
      }
    });
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="sm:p-0 p-0 mb-4">
        <CardTitle className="flex items-center gap-2">
          <Icon name="settings" />
          Налаштування акаунту
        </CardTitle>
        <CardDescription>Додаткові налаштування для вашого акаунту</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:px-0 px-0">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="session">Поточний сеанс</Label>
            <Input value={user?.email} readOnly />
          </div>

          <div className="space-y-2">
            <Label>Статус акаунту</Label>
            <div className="h-12 px-4 py-2 rounded-lg border border-border bg-muted flex items-center text-muted-foreground">
              <Icon name="check_circle" className="mr-2" />
              Активний
            </div>
          </div>

          <div className="space-y-2">
            <Label>ID користувача</Label>
            <div className="h-12 px-4 py-2 rounded-lg border border-border bg-muted flex items-center text-muted-foreground">
              {user.id}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Дата реєстрації</Label>
            <div className="h-12 px-4 py-2 rounded-lg border border-border bg-muted flex items-center text-muted-foreground">
              {user.created_at
                ? new Date(user.created_at).toLocaleDateString('uk-UA')
                : 'Невідомо'}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            <Icon name="key" />
            Змінити пароль
          </Button>
          <Button
            variant="red"
            onClick={handleLogout}
          >
            <Icon name="logout" />
            Вийти
          </Button>
          {/* <Button variant="outline" className="flex items-center gap-2">
                <Icon name="bell" />
                Налаштування сповіщень
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
                <Icon name="shield" />
                Безпека
            </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
