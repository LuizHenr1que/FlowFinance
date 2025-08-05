import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Shield, Mail, Calendar, ExternalLink } from "lucide-react";

interface EmailTemplateProps {
  inviterName: string;
  inviterEmail: string;
  companyName: string;
  role: string;
  department: string;
  permissions: string[];
  invitedEmail: string;
  inviteLink: string;
  expiresAt: string;
}

const EmailTemplate = ({
  inviterName,
  inviterEmail,
  companyName,
  role,
  department,
  permissions,
  invitedEmail,
  inviteLink,
  expiresAt
}: EmailTemplateProps) => {
  const getRoleLabel = (role: string) => {
    switch (role) {
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

  const getPermissionLabel = (permission: string) => {
    switch (permission) {
      case 'view_finances':
        return 'Ver Finanças';
      case 'manage_transactions':
        return 'Gerenciar Transações';
      case 'view_reports':
        return 'Ver Relatórios';
      case 'manage_goals':
        return 'Gerenciar Metas';
      case 'manage_budgets':
        return 'Gerenciar Orçamentos';
      default:
        return permission;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background">
      {/* Template do Email - Visualização */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 rounded-lg border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2">FinanceFlow</h1>
          <p className="text-muted-foreground">Sistema de Gestão Financeira</p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center bg-primary/5">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Você foi convidado para a equipe!
            </h2>
            <p className="text-muted-foreground">
              {inviterName} convidou você para participar da equipe da {companyName}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary" />
                Detalhes do Convite
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email convidado:</span>
                  <span className="font-medium">{invitedEmail}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Empresa:</span>
                  <span className="font-medium">{companyName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Departamento:</span>
                  <span className="font-medium">{department}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Função:</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleLabel(role)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Suas permissões:</h4>
              <div className="flex flex-wrap gap-2">
                {permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {getPermissionLabel(permission)}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-warning">
                <Calendar className="h-4 w-4" />
                <span className="font-medium text-sm">Convite válido até:</span>
              </div>
              <p className="text-sm mt-1 font-semibold">
                {new Date(expiresAt).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-3">
                  Clique no botão abaixo para aceitar o convite e criar sua conta:
                </p>
                
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Aceitar Convite
                </Button>
                
                <p className="text-xs text-muted-foreground mt-3">
                  Ou copie e cole este link no seu navegador:
                </p>
                <div className="bg-muted p-2 rounded mt-2 text-xs font-mono break-all">
                  {inviteLink}
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>Convidado por: <strong>{inviterName}</strong> ({inviterEmail})</p>
              <p className="mt-2">
                Se você não esperava este convite, pode ignorar este email com segurança.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>© 2024 FinanceFlow. Todos os direitos reservados.</p>
          <p>Este é um email automático, por favor não responda.</p>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplate;