import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Shield,
  Trash2,
  LogOut,
  CheckCircle
} from "lucide-react";

interface Session {
  id: string;
  device: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  location: string;
  ipAddress: string;
  lastActivity: string;
  isCurrent: boolean;
  isActive: boolean;
}

interface SessionManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SessionManagerModal: React.FC<SessionManagerModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Windows PC',
      deviceType: 'desktop',
      browser: 'Chrome 119.0',
      location: 'São Paulo, SP',
      ipAddress: '192.168.1.100',
      lastActivity: '2024-08-05T10:30:00',
      isCurrent: true,
      isActive: true
    },
    {
      id: '2',
      device: 'iPhone 15',
      deviceType: 'mobile',
      browser: 'Safari 17.0',
      location: 'São Paulo, SP',
      ipAddress: '192.168.1.101',
      lastActivity: '2024-08-05T09:15:00',
      isCurrent: false,
      isActive: true
    },
    {
      id: '3',
      device: 'iPad Pro',
      deviceType: 'tablet',
      browser: 'Safari 17.0',
      location: 'Rio de Janeiro, RJ',
      ipAddress: '189.123.45.67',
      lastActivity: '2024-08-04T14:22:00',
      isCurrent: false,
      isActive: true
    },
    {
      id: '4',
      device: 'Android Phone',
      deviceType: 'mobile',
      browser: 'Chrome Mobile 119.0',
      location: 'Belo Horizonte, MG',
      ipAddress: '177.234.56.78',
      lastActivity: '2024-08-03T16:45:00',
      isCurrent: false,
      isActive: false
    }
  ]);

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'desktop':
        return Monitor;
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const formatLastActivity = (dateString: string) => {
    const now = new Date();
    const activityDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Ativa agora';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} dia${diffInDays > 1 ? 's' : ''} atrás`;
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter(session => session.id !== sessionId));
    toast({
      title: "Sessão revogada",
      description: "A sessão foi encerrada com sucesso.",
    });
  };

  const handleRevokeAllOtherSessions = () => {
    const currentSession = sessions.find(s => s.isCurrent);
    if (currentSession) {
      setSessions([currentSession]);
      toast({
        title: "Sessões revogadas",
        description: "Todas as outras sessões foram encerradas.",
      });
    }
  };

  const activeSessions = sessions.filter(s => s.isActive);
  const inactiveSessions = sessions.filter(s => !s.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Gerenciar Sessões</span>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os dispositivos conectados à sua conta
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Sessões Ativas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {activeSessions.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Localizações Únicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {new Set(sessions.map(s => s.location)).size}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {sessions.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center space-x-2">
                      <LogOut className="h-4 w-4" />
                      <span>Encerrar Todas as Outras Sessões</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Encerrar todas as outras sessões?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá desconectar todos os outros dispositivos da sua conta. 
                        Você precisará fazer login novamente nesses dispositivos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRevokeAllOtherSessions}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="outline" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Habilitar Alerta de Login</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sessões Ativas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span>Sessões Ativas ({activeSessions.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => {
                  const DeviceIcon = getDeviceIcon(session.deviceType);
                  
                  return (
                    <div key={session.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg bg-primary/10">
                            <DeviceIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{session.device}</h3>
                              {session.isCurrent && (
                                <Badge variant="default" className="text-xs">
                                  Este dispositivo
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Monitor className="h-3 w-3" />
                                <span>{session.browser}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{session.location}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatLastActivity(session.lastActivity)}</span>
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              IP: {session.ipAddress}
                            </p>
                          </div>
                        </div>
                        
                        {!session.isCurrent && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                                <Trash2 className="h-4 w-4" />
                                <span>Revogar</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revogar sessão?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação irá desconectar este dispositivo da sua conta imediatamente.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRevokeSession(session.id)}>
                                  Revogar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                      {index < activeSessions.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Sessões Inativas (se houver) */}
          {inactiveSessions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>Sessões Recentes ({inactiveSessions.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inactiveSessions.map((session, index) => {
                    const DeviceIcon = getDeviceIcon(session.deviceType);
                    
                    return (
                      <div key={session.id}>
                        <div className="flex items-center justify-between opacity-60">
                          <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-lg bg-muted">
                              <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium">{session.device}</h3>
                                <Badge variant="outline" className="text-xs">
                                  Desconectado
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <Monitor className="h-3 w-3" />
                                  <span>{session.browser}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{session.location}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatLastActivity(session.lastActivity)}</span>
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                IP: {session.ipAddress}
                              </p>
                            </div>
                          </div>
                        </div>
                        {index < inactiveSessions.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionManagerModal;