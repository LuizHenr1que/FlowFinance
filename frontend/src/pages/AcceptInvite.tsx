import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Building, Shield, Mail, CheckCircle } from "lucide-react";

// Mock data baseado no token do convite
const mockInviteData = {
  inviterName: "João Silva",
  inviterEmail: "joao.silva@techcorp.com",
  companyName: "TechCorp Solutions",
  role: "admin",
  department: "Financeiro",
  permissions: ["view_finances", "manage_transactions", "view_reports"],
  expiresAt: "2024-08-15",
  invitedEmail: "maria.santos@techcorp.com"
};

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "Por favor, confirme sua senha corretamente.",
        variant: "destructive",
      });
      return;
    }

    // Simular aceitação do convite
    setTimeout(() => {
      setStep("success");
      toast({
        title: "Convite aceito!",
        description: "Bem-vindo à equipe! Você pode fazer login agora.",
      });
    }, 1000);
  };

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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Convite Inválido</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              O link do convite é inválido ou expirou.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-success">Convite Aceito!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Bem-vindo à equipe da <strong>{mockInviteData.companyName}</strong>!
            </p>
            <p className="text-sm text-muted-foreground">
              Sua conta foi criada com sucesso. Você pode fazer login agora.
            </p>
            <Link to="/login">
              <Button className="w-full">
                Fazer Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Informações do Convite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>Convite para a Equipe</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{mockInviteData.companyName}</p>
                <p className="text-sm text-muted-foreground">{mockInviteData.department}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm">Convidado por:</p>
                <p className="font-medium">{mockInviteData.inviterName}</p>
                <p className="text-sm text-muted-foreground">{mockInviteData.inviterEmail}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Função:</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {getRoleLabel(mockInviteData.role)}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Permissões:</p>
                <div className="flex flex-wrap gap-1">
                  {mockInviteData.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {getPermissionLabel(permission)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Este convite expira em: <strong>{new Date(mockInviteData.expiresAt).toLocaleDateString('pt-BR')}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Formulário de Aceitação */}
        <Card>
          <CardHeader>
            <CardTitle>Complete seu Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={mockInviteData.invitedEmail}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  placeholder="Crie uma senha segura"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Link to="/login" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" className="flex-1">
                  Aceitar Convite
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcceptInvite;