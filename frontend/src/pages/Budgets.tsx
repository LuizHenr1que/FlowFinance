import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import BudgetForm from "@/components/forms/BudgetForm";
import { useToast } from "@/hooks/use-toast";
import { 
  PieChart, 
  Plus, 
  Edit, 
  Trash2,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from "lucide-react";

// Mock data - em um sistema real viria da API
const budgets = [
  {
    id: 1,
    name: "Alimentação",
    category: "Essencial",
    budgetAmount: 800.00,
    spentAmount: 567.30,
    period: "monthly",
    status: "on_track",
    icon: "🍽️"
  },
  {
    id: 2,
    name: "Transporte",
    category: "Essencial", 
    budgetAmount: 400.00,
    spentAmount: 445.80,
    period: "monthly",
    status: "over_budget",
    icon: "🚗"
  },
  {
    id: 3,
    name: "Entretenimento",
    category: "Lazer",
    budgetAmount: 300.00,
    spentAmount: 125.50,
    period: "monthly", 
    status: "under_budget",
    icon: "🎬"
  },
  {
    id: 4,
    name: "Roupas",
    category: "Pessoal",
    budgetAmount: 200.00,
    spentAmount: 195.00,
    period: "monthly",
    status: "near_limit",
    icon: "👕"
  },
  {
    id: 5,
    name: "Saúde",
    category: "Essencial",
    budgetAmount: 250.00,
    spentAmount: 78.40,
    period: "monthly",
    status: "on_track",
    icon: "🏥"
  },
  {
    id: 6,
    name: "Educação",
    category: "Desenvolvimento",
    budgetAmount: 150.00,
    spentAmount: 149.90,
    period: "monthly",
    status: "near_limit",
    icon: "📚"
  }
];

const Budgets = () => {
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [budgetsList, setBudgetsList] = useState(budgets);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<any>(null);
  const { toast } = useToast();

  const handleNewBudget = () => {
    setSelectedBudget(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: any) => {
    setSelectedBudget(budget);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log('Budget data:', data);
    setIsModalOpen(false);
    setSelectedBudget(null);
  };

  const handleDeleteBudget = (budgetId: number) => {
    const budget = budgetsList.find(b => b.id === budgetId);
    setBudgetToDelete(budget);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBudget = () => {
    if (budgetToDelete) {
      setBudgetsList(budgetsList.filter(budget => budget.id !== budgetToDelete.id));
      toast({
        title: "Orçamento removido",
        description: "O orçamento foi removido com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setBudgetToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-success/10 text-success';
      case 'near_limit':
        return 'bg-warning/10 text-warning';
      case 'over_budget':
        return 'bg-destructive/10 text-destructive';
      case 'under_budget':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'No Limite';
      case 'near_limit':
        return 'Perto do Limite';
      case 'over_budget':
        return 'Acima do Orçamento';
      case 'under_budget':
        return 'Abaixo do Orçamento';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track':
      case 'under_budget':
        return CheckCircle;
      case 'near_limit':
      case 'over_budget':
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Essencial':
        return 'bg-success/10 text-success';
      case 'Lazer':
        return 'bg-primary/10 text-primary';
      case 'Pessoal':
        return 'bg-warning/10 text-warning';
      case 'Desenvolvimento':
        return 'bg-secondary/10 text-secondary';
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

  const getProgressValue = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 90) return 'bg-warning';
    return 'bg-success';
  };

  const totalBudget = budgetsList.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const totalSpent = budgetsList.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overBudgetCount = budgetsList.filter(b => b.status === 'over_budget').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Orçamentos
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus gastos e mantenha suas finanças no controle
            </p>
          </div>
          <Button onClick={handleNewBudget} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Novo Orçamento</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Orçamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalBudget)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Gasto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalSpent)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Restante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(totalRemaining)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground flex items-center">
                {overBudgetCount > 0 && (
                  <AlertCircle className="h-5 w-5 mr-1 text-destructive" />
                )}
                {overBudgetCount}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Budget Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Visão Geral do Orçamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(totalSpent)} de {formatCurrency(totalBudget)}
                </span>
              </div>
              <Progress 
                value={getProgressValue(totalSpent, totalBudget)} 
                className="h-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{((totalSpent / totalBudget) * 100).toFixed(1)}% utilizado</span>
                <span>{((totalRemaining / totalBudget) * 100).toFixed(1)}% restante</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetsList.map((budget) => {
            const StatusIcon = getStatusIcon(budget.status);
            const progressValue = getProgressValue(budget.spentAmount, budget.budgetAmount);
            
            return (
              <Card key={budget.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{budget.icon}</span>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {budget.name}
                        </h3>
                        <Badge variant="secondary" className={getCategoryColor(budget.category)}>
                          {budget.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(budget.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusLabel(budget.status)}
                      </Badge>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => handleEditBudget(budget)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Gasto</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(budget.spentAmount)} / {formatCurrency(budget.budgetAmount)}
                    </span>
                  </div>
                  
                  <Progress 
                    value={progressValue} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {progressValue.toFixed(1)}% utilizado
                    </span>
                    <span className={`font-medium ${
                      budget.budgetAmount - budget.spentAmount >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {budget.budgetAmount - budget.spentAmount >= 0 ? 'Restam' : 'Excesso'}: {' '}
                      {formatCurrency(Math.abs(budget.budgetAmount - budget.spentAmount))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Modal de Formulário */}
        <BudgetForm
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedBudget(null);
          }}
          onSubmit={handleSubmit}
          initialData={isEditMode ? selectedBudget : undefined}
          title={isEditMode ? "Editar Orçamento" : "Novo Orçamento"}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteBudget}
          title="Deletar Orçamento"
          description="Tem certeza que deseja deletar este orçamento?"
          itemName={budgetToDelete?.name}
        />
      </div>
    </MainLayout>
  );
};

export default Budgets;