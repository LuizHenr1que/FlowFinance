import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, CreditCard, AlertTriangle, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  type: 'warning' | 'info' | 'urgent';
  title: string;
  description: string;
  date: string;
  isRead: boolean;
  icon: React.ReactNode;
}

const NotificationButton: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'urgent',
      title: 'Fatura Vencendo',
      description: 'Cartão Empresarial Principal vence em 2 dias',
      date: '2024-08-05',
      isRead: false,
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'warning',
      title: 'Limite Alto',
      description: 'Cartão Compras Online com 85% do limite usado',
      date: '2024-08-04',
      isRead: false,
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'info',
      title: 'Meta de Orçamento',
      description: 'Orçamento de Marketing atingiu 75%',
      date: '2024-08-03',
      isRead: true,
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: 4,
      type: 'info',
      title: 'Reunião Financeira',
      description: 'Revisão mensal agendada para amanhã',
      date: '2024-08-02',
      isRead: false,
      icon: <Calendar className="h-4 w-4" />
    },
    {
      id: 5,
      type: 'urgent',
      title: 'Pagamento Pendente',
      description: 'Fatura do Cartão Viagens em atraso',
      date: '2024-08-01',
      isRead: false,
      icon: <CreditCard className="h-4 w-4" />
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'text-destructive';
      case 'warning':
        return 'text-orange-500';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 hover:bg-accent"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-0"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 max-h-96 overflow-y-auto" 
        align="end"
        sideOffset={5}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-6 px-2"
            >
              Marcar todas como lida
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start p-4 cursor-pointer space-y-1",
                !notification.isRead && "bg-accent/50"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-3 w-full">
                <div className={cn("mt-1", getNotificationColor(notification.type))}>
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      !notification.isRead && "font-semibold"
                    )}>
                      {notification.title}
                    </p>
                    <Badge
                      variant={getBadgeVariant(notification.type)}
                      className="ml-2 text-xs"
                    >
                      {notification.type === 'urgent' && 'Urgente'}
                      {notification.type === 'warning' && 'Atenção'}
                      {notification.type === 'info' && 'Info'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(notification.date)}
                  </p>
                </div>
              </div>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-primary rounded-full absolute right-2 top-4" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationButton;