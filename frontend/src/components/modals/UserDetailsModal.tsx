import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar, 
  Clock, 
  Shield,
  Users,
  Crown,
  UserCheck
} from 'lucide-react';

interface UserDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: any;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  open,
  onOpenChange,
  member,
}) => {
  if (!member) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'admin':
        return Shield;
      case 'manager':
        return UserCheck;
      case 'employee':
        return Users;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-warning/10 text-warning';
      case 'admin':
        return 'bg-destructive/10 text-destructive';
      case 'manager':
        return 'bg-primary/10 text-primary';
      case 'employee':
        return 'bg-secondary/10 text-secondary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Proprietário';
      case 'admin':
        return 'Administrador';
      case 'manager':
        return 'Gerente';
      case 'employee':
        return 'Funcionário';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'pending':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'inactive':
        return 'Inativo';
      case 'pending':
        return 'Pendente';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Nunca acessou';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPermissionLabel = (permission: string) => {
    const labels: { [key: string]: string } = {
      'all': 'Todas as permissões',
      'view_finances': 'Ver Finanças',
      'manage_transactions': 'Gerenciar Transações',
      'view_reports': 'Ver Relatórios',
      'manage_goals': 'Gerenciar Metas',
      'manage_budgets': 'Gerenciar Orçamentos',
    };
    return labels[permission] || permission;
  };

  const RoleIcon = getRoleIcon(member.role);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{member.name}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className={getRoleColor(member.role)}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {getRoleLabel(member.role)}
                </Badge>
                <Badge variant="outline" className={getStatusColor(member.status)}>
                  {getStatusLabel(member.status)}
                </Badge>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Detalhes completos do membro da equipe
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <div className="space-y-6">
          {/* Informações de Contato */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Informações de Contato</h3>
            
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{member.email}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Telefone:</span>
              <span className="font-medium">{member.phone}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Empresa:</span>
              <span className="font-medium">{member.company}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Departamento:</span>
              <span className="font-medium">{member.department}</span>
            </div>
          </div>

          <Separator />

          {/* Informações de Acesso */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Informações de Acesso</h3>
            
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Membro desde:</span>
              <span className="font-medium">{formatDate(member.joinedAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Último acesso:</span>
              <span className="font-medium">{formatDateTime(member.lastAccess)}</span>
            </div>
          </div>

          <Separator />

          {/* Permissões */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Permissões do Sistema</h3>
            
            <div className="flex flex-wrap gap-2">
              {member.permissions.map((permission: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {getPermissionLabel(permission)}
                </Badge>
              ))}
            </div>
          </div>

          {member.status === 'pending' && (
            <>
              <Separator />
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <p className="text-sm text-warning-foreground">
                  <strong>Convite Pendente:</strong> Este usuário ainda não aceitou o convite para acessar o sistema.
                </p>
              </div>
            </>
          )}
          
          {member.status === 'inactive' && (
            <>
              <Separator />
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  <strong>Usuário Inativo:</strong> Este usuário foi desativado e não pode acessar o sistema.
                </p>
              </div>
            </>
          )}
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;