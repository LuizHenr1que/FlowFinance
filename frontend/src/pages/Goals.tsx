import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import GoalForm from "@/components/forms/GoalForm";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2,
  Calendar,
  TrendingUp,
  DollarSign,
  Home,
  Car,
  GraduationCap,
  Plane
} from "lucide-react";

// Mock data - em um sistema real viria da API
const goals = [
  {
    id: 1,
    name: "Emergência Financeira",
    description: "Reserva para emergências (6 meses de gastos)",
    targetAmount: 30000.00,
    currentAmount: 18500.00,
    targetDate: "2024-12-31",
    category: "emergency",
    priority: "high",
    status: "active",
    monthlyContribution: 1500.00
  },
  {
    id: 2,
    name: "Casa Própria",
    description: "Entrada para financiamento da casa",
    targetAmount: 80000.00,
    currentAmount: 25600.00,
    targetDate: "2026-06-30",
    category: "house",
    priority: "high",
    status: "active",
    monthlyContribution: 2200.00
  },
  {
    id: 3,
    name: "Carro Novo",
    description: "Trocar o carro atual por um modelo mais novo",
    targetAmount: 45000.00,
    currentAmount: 12300.00,
    targetDate: "2025-08-15",
    category: "vehicle",
    priority: "medium",
    status: "active",
    monthlyContribution: 1800.00
  },
  {
    id: 4,
    name: "Curso de MBA",
    description: "Especialização em Gestão de Negócios",
    targetAmount: 15000.00,
    currentAmount: 14200.00,
    targetDate: "2024-09-01",
    category: "education",
    priority: "medium",
    status: "almost_complete",
    monthlyContribution: 400.00
  },
  {
    id: 5,
    name: "Viagem Europa",
    description: "Viagem de férias para Europa (15 dias)",
    targetAmount: 12000.00,
    currentAmount: 3400.00,
    targetDate: "2025-07-01",
    category: "travel",
    priority: "low",
    status: "active",
    monthlyContribution: 600.00
  },
  {
    id: 6,
    name: "Aposentadoria",
    description: "Fundo para aposentadoria complementar",
    targetAmount: 500000.00,
    currentAmount: 45800.00,
    targetDate: "2040-12-31",
    category: "retirement",
    priority: "high",
    status: "active",
    monthlyContribution: 1000.00
  }
];

const Goals = () => {
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [goalsList, setGoalsList] = useState(goals);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<any>(null);
  const { toast } = useToast();

  const handleNewGoal = () => {
    setSelectedGoal(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
    console.log('Goal data:', data);
    setIsModalOpen(false);
    setSelectedGoal(null);
  };

  const handleDeleteGoal = (goalId: number) => {
    const goal = goalsList.find(g => g.id === goalId);
    setGoalToDelete(goal);
    setShowDeleteDialog(true);
  };

  const confirmDeleteGoal = () => {
    if (goalToDelete) {
      setGoalsList(goalsList.filter(goal => goal.id !== goalToDelete.id));
      toast({
        title: "Meta removida",
        description: "A meta foi removida com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setGoalToDelete(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'house':
        return Home;
      case 'vehicle':
        return Car;
      case 'education':
        return GraduationCap;
      case 'travel':
        return Plane;
      case 'emergency':
      case 'retirement':
        return DollarSign;
      default:
        return Target;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'house':
        return 'bg-primary/10 text-primary';
      case 'vehicle':
        return 'bg-warning/10 text-warning';
      case 'education':
        return 'bg-secondary/10 text-secondary';
      case 'travel':
        return 'bg-destructive/10 text-destructive';
      case 'emergency':
        return 'bg-success/10 text-success';
      case 'retirement':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'low':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary/10 text-primary';
      case 'almost_complete':
        return 'bg-warning/10 text-warning';
      case 'completed':
        return 'bg-success/10 text-success';
      case 'paused':
        return 'bg-muted text-muted-foreground';
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

  const getProgressValue = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateMonthsRemaining = (targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 0);
  };

  const totalTargetAmount = goalsList.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goalsList.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalMonthlyContribution = goalsList.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const completedGoals = goalsList.filter(g => g.status === 'completed').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Metas Financeiras
            </h1>
            <p className="text-muted-foreground">
              Defina e acompanhe seus objetivos financeiros
            </p>
          </div>
          <Button onClick={handleNewGoal} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Meta</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total das Metas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalTargetAmount)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Acumulado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalCurrentAmount)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contribuição Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalMonthlyContribution)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground flex items-center">
                <TrendingUp className="h-5 w-5 mr-1 text-success" />
                {((totalCurrentAmount / totalTargetAmount) * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral do Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progresso Total das Metas</span>
                <span className="text-sm text-muted-foreground">
                  {formatCurrency(totalCurrentAmount)} de {formatCurrency(totalTargetAmount)}
                </span>
              </div>
              <Progress 
                value={getProgressValue(totalCurrentAmount, totalTargetAmount)} 
                className="h-3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Goals List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {goalsList.map((goal) => {
            const Icon = getCategoryIcon(goal.category);
            const progressValue = getProgressValue(goal.currentAmount, goal.targetAmount);
            const monthsRemaining = calculateMonthsRemaining(goal.targetDate);
            const remainingAmount = goal.targetAmount - goal.currentAmount;
            
            return (
              <Card key={goal.id} className="transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {goal.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {goal.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className={getCategoryColor(goal.category)}>
                            {goal.category}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                            {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(goal.status)}>
                            {goal.status === 'active' ? 'Ativo' : 
                             goal.status === 'almost_complete' ? 'Quase Completo' : 
                             goal.status === 'completed' ? 'Completo' : 'Pausado'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progresso</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress value={progressValue} className="h-2 mb-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{progressValue.toFixed(1)}% concluído</span>
                      <span>Faltam: {formatCurrency(remainingAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Contribuição Mensal</p>
                      <p className="font-medium text-foreground">
                        {formatCurrency(goal.monthlyContribution)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Prazo
                      </p>
                      <p className="font-medium text-foreground">
                        {formatDate(goal.targetDate)}
                      </p>
                    </div>
                  </div>
                  
                  {monthsRemaining > 0 && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <strong>{monthsRemaining} meses restantes</strong> • 
                      Se mantiver a contribuição atual, você atingirá sua meta em {formatDate(goal.targetDate)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Modal de Formulário */}
        <GoalForm
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setSelectedGoal(null);
          }}
          onSubmit={handleSubmit}
          initialData={isEditMode ? selectedGoal : undefined}
          title={isEditMode ? "Editar Meta" : "Nova Meta"}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteGoal}
          title="Deletar Meta"
          description="Tem certeza que deseja deletar esta meta financeira?"
          itemName={goalToDelete?.name}
        />
      </div>
    </MainLayout>
  );
};

export default Goals;