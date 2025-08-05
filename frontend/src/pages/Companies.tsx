import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import CompanyForm from "@/components/forms/CompanyForm";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

// Mock data - em um sistema real viria da API
const companies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    cnpj: "12.345.678/0001-90",
    type: "Tecnologia",
    status: "active",
    monthlyRevenue: 45000.00,
    monthlyExpenses: 32000.00,
    employees: 12,
    address: "São Paulo, SP",
    phone: "(11) 99999-9999",
    email: "contato@techcorp.com",
    createdAt: "2023-01-15"
  },
  {
    id: 2,
    name: "Consultoria ABC",
    cnpj: "98.765.432/0001-10",
    type: "Consultoria",
    status: "active",
    monthlyRevenue: 28000.00,
    monthlyExpenses: 18500.00,
    employees: 8,
    address: "Rio de Janeiro, RJ",
    phone: "(21) 88888-8888",
    email: "info@consultoriaabc.com",
    createdAt: "2023-03-22"
  },
  {
    id: 3,
    name: "E-commerce Plus",
    cnpj: "11.222.333/0001-44",
    type: "E-commerce",
    status: "active",
    monthlyRevenue: 67000.00,
    monthlyExpenses: 45000.00,
    employees: 25,
    address: "Belo Horizonte, MG",
    phone: "(31) 77777-7777",
    email: "vendas@ecommerceplus.com",
    createdAt: "2022-11-08"
  },
  {
    id: 4,
    name: "Startup Inovação",
    cnpj: "55.666.777/0001-88",
    type: "Startup",
    status: "inactive",
    monthlyRevenue: 0.00,
    monthlyExpenses: 5000.00,
    employees: 3,
    address: "Florianópolis, SC",
    phone: "(48) 66666-6666",
    email: "contato@startupinovacao.com",
    createdAt: "2024-01-10"
  }
];

const Companies = () => {
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [companiesList, setCompaniesList] = useState(companies);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<any>(null);
  const { toast } = useToast();

  const handleNewCompany = () => {
    setSelectedCompany(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditCompany = (company: any) => {
    setSelectedCompany(company);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log('Company data:', data);
    setIsModalOpen(false);
    setSelectedCompany(null);
  };

  const handleDeleteCompany = (companyId: number) => {
    const company = companiesList.find(c => c.id === companyId);
    setCompanyToDelete(company);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCompany = () => {
    if (companyToDelete) {
      setCompaniesList(companiesList.filter(company => company.id !== companyToDelete.id));
      toast({
        title: "Empresa removida",
        description: "A empresa foi removida com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setCompanyToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'inactive':
        return 'bg-muted text-muted-foreground';
      case 'suspended':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativa';
      case 'inactive':
        return 'Inativa';
      case 'suspended':
        return 'Suspensa';
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tecnologia':
        return 'bg-primary/10 text-primary';
      case 'Consultoria':
        return 'bg-secondary/10 text-secondary';
      case 'E-commerce':
        return 'bg-warning/10 text-warning';
      case 'Startup':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalRevenue = companiesList
    .filter(c => c.status === 'active')
    .reduce((sum, company) => sum + company.monthlyRevenue, 0);
  
  const totalExpenses = companiesList
    .filter(c => c.status === 'active')
    .reduce((sum, company) => sum + company.monthlyExpenses, 0);
  
  const totalProfit = totalRevenue - totalExpenses;
  const activeCompanies = companiesList.filter(c => c.status === 'active').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Empresas
            </h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas empresas e informações corporativas
            </p>
          </div>
          <Button onClick={handleNewCompany} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Empresa</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Empresas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activeCompanies}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Despesas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro Líquido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                <TrendingUp className="h-5 w-5 mr-1" />
                {formatCurrency(totalProfit)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companiesList.map((company) => (
            <Card key={company.id} className="transition-all hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {company.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        CNPJ: {company.cnpj}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className={getTypeColor(company.type)}>
                          {company.type}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(company.status)}>
                          {getStatusLabel(company.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditCompany(company)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteCompany(company.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Financial Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Receita Mensal</p>
                    <p className="text-sm font-semibold text-success">
                      {formatCurrency(company.monthlyRevenue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Despesas Mensais</p>
                    <p className="text-sm font-semibold text-destructive">
                      {formatCurrency(company.monthlyExpenses)}
                    </p>
                  </div>
                </div>
                
                {/* Profit */}
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Lucro Mensal</span>
                    <span className={`text-sm font-semibold flex items-center ${
                      (company.monthlyRevenue - company.monthlyExpenses) >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatCurrency(company.monthlyRevenue - company.monthlyExpenses)}
                    </span>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>{company.employees} funcionários</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{company.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{company.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span>{company.email}</span>
                  </div>
                </div>
                
                {/* Founded Date */}
                <div className="text-xs text-muted-foreground border-t pt-2">
                  Fundada em {formatDate(company.createdAt)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de Formulário */}
        <CompanyForm
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedCompany(null);
          }}
          onSubmit={handleSubmit}
          initialData={isEditMode ? selectedCompany : undefined}
          title={isEditMode ? "Editar Empresa" : "Nova Empresa"}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteCompany}
          title="Deletar Empresa"
          description="Tem certeza que deseja deletar esta empresa?"
          itemName={companyToDelete?.name}
        />
      </div>
    </MainLayout>
  );
};

export default Companies;