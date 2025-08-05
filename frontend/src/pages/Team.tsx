import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

import TeamMemberForm from "@/components/forms/TeamMemberForm";
import UserDetailsModal from "@/components/modals/UserDetailsModal";
import { 
  Users, 
  Plus, 
  Edit, 
  Mail,
  Phone,
  Shield,
  Eye,
  UserCheck,
  UserX,
  Crown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Mock data - em um sistema real viria da API
const teamMembers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@techcorp.com",
    phone: "(11) 99999-1111",
    role: "owner",
    department: "Administração",
    company: "TechCorp Solutions",
    status: "active",
    joinedAt: "2023-01-15",
    lastAccess: "2024-08-04T10:30:00",
    permissions: ["all"]
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@techcorp.com",
    phone: "(11) 99999-2222",
    role: "admin",
    department: "Financeiro",
    company: "TechCorp Solutions", 
    status: "active",
    joinedAt: "2023-02-01",
    lastAccess: "2024-08-04T09:15:00",
    permissions: ["view_finances", "manage_transactions", "view_reports"]
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos.oliveira@consultoriaabc.com",
    phone: "(21) 88888-3333",
    role: "manager",
    department: "Vendas",
    company: "Consultoria ABC",
    status: "active",
    joinedAt: "2023-03-22",
    lastAccess: "2024-08-03T16:45:00",
    permissions: ["view_finances", "manage_goals"]
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@ecommerceplus.com",
    phone: "(31) 77777-4444",
    role: "employee",
    department: "Marketing",
    company: "E-commerce Plus",
    status: "active",
    joinedAt: "2023-05-10",
    lastAccess: "2024-08-04T08:20:00",
    permissions: ["view_reports"]
  },
  {
    id: 5,
    name: "Pedro Mendes",
    email: "pedro.mendes@techcorp.com",
    phone: "(11) 99999-5555",
    role: "employee",
    department: "Desenvolvimento",
    company: "TechCorp Solutions",
    status: "inactive",
    joinedAt: "2023-06-15",
    lastAccess: "2024-07-20T14:30:00",
    permissions: ["view_reports"]
  },
  {
    id: 6,
    name: "Lucia Ferreira",
    email: "lucia.ferreira@startupinovacao.com",
    phone: "(48) 66666-6666",
    role: "admin",
    department: "Operações",
    company: "Startup Inovação",
    status: "pending",
    joinedAt: "2024-08-01",
    lastAccess: null,
    permissions: ["view_finances", "manage_budgets"]
  }
];

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [detailsMember, setDetailsMember] = useState<any>(null);
  const [members, setMembers] = useState(teamMembers);
  const { toast } = useToast();

  const handleNewMember = () => {
    setSelectedMember(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log('Member data:', data);
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleViewDetails = (member: any) => {
    setDetailsMember(member);
    setShowUserDetails(true);
  };

  const handleToggleUserStatus = (memberId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    setMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, status: newStatus }
        : member
    ));

    const action = newStatus === 'active' ? 'ativado' : 'desativado';
    const member = members.find(m => m.id === memberId);
    
    toast({
      title: `Usuário ${action}!`,
      description: `${member?.name} foi ${action} com sucesso.`,
      variant: newStatus === 'active' ? 'default' : 'destructive',
    });
  };

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
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatLastAccess = (dateString: string | null) => {
    if (!dateString) return 'Nunca acessou';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const activeMembers = members.filter(m => m.status === 'active').length;
  const pendingMembers = members.filter(m => m.status === 'pending').length;
  const totalCompanies = new Set(members.map(m => m.company)).size;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Equipe e Permissões
            </h1>
            <p className="text-muted-foreground">
              Gerencie usuários, funções e permissões do sistema
            </p>
          </div>
          <Button onClick={handleNewMember} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Convidar Usuário</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Membros Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activeMembers}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Convites Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {pendingMembers}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalCompanies}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Membros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {members.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Team Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Membros da Equipe</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                
                return (
                  <div 
                    key={member.id} 
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.department} • {member.company}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getRoleColor(member.role)}>
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {getRoleLabel(member.role)}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(member.status)}>
                            {getStatusLabel(member.status)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            Último acesso: {formatLastAccess(member.lastAccess)}
                          </span>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(member)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditMember(member)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar Permissões
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {member.status === 'active' ? (
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleToggleUserStatus(member.id, member.status)}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Desativar Usuário
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-success focus:text-success"
                                  onClick={() => handleToggleUserStatus(member.id, member.status)}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Ativar Usuário
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {/* Permissions */}
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">Permissões:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission === 'all' ? 'Todas as permissões' :
                               permission === 'view_finances' ? 'Ver Finanças' :
                               permission === 'manage_transactions' ? 'Gerenciar Transações' :
                               permission === 'view_reports' ? 'Ver Relatórios' :
                               permission === 'manage_goals' ? 'Gerenciar Metas' :
                               permission === 'manage_budgets' ? 'Gerenciar Orçamentos' :
                               permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        Membro desde {formatDate(member.joinedAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Modal de Formulário */}
        <TeamMemberForm
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedMember(null);
          }}
          onSubmit={handleSubmit}
          initialData={isEditMode ? selectedMember : undefined}
          title={isEditMode ? "Editar Membro" : "Convidar Usuário"}
        />

        {/* Modal de Detalhes do Usuário */}
        <UserDetailsModal
          open={showUserDetails}
          onOpenChange={setShowUserDetails}
          member={detailsMember}
        />
      </div>
    </MainLayout>
  );
};

export default Team;