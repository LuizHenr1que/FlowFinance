import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Eye, 
  BarChart3,
  PieChart,
  Edit,
  Trash2
} from "lucide-react";
import { InvestmentForm } from "@/components/forms/InvestmentForm";
import { useToast } from "@/hooks/use-toast";

// Mock data - em um sistema real viria da API
const investments = [
  {
    id: 1,
    name: "CDB Premium",
    type: "fixed_income",
    institution: "Banco XYZ",
    currentValue: 12500.00,
    investedValue: 10000.00,
    profitLoss: 2500.00,
    profitLossPercent: 25.0,
    maturityDate: "2025-12-31",
    risk: "low"
  },
  {
    id: 2,
    name: "Fundo Multimercado",
    type: "fund",
    institution: "Gestora ABC",
    currentValue: 8750.30,
    investedValue: 8000.00,
    profitLoss: 750.30,
    profitLossPercent: 9.38,
    maturityDate: null,
    risk: "medium"
  },
  {
    id: 3,
    name: "PETR4 - Petrobras",
    type: "stock",
    institution: "B3",
    currentValue: 5420.80,
    investedValue: 6000.00,
    profitLoss: -579.20,
    profitLossPercent: -9.65,
    maturityDate: null,
    risk: "high"
  },
  {
    id: 4,
    name: "Tesouro Selic 2027",
    type: "treasury",
    institution: "Tesouro Nacional",
    currentValue: 15800.45,
    investedValue: 15000.00,
    profitLoss: 800.45,
    profitLossPercent: 5.34,
    maturityDate: "2027-03-01",
    risk: "low"
  },
  {
    id: 5,
    name: "Bitcoin",
    type: "crypto",
    institution: "Exchange DEF",
    currentValue: 2850.60,
    investedValue: 3500.00,
    profitLoss: -649.40,
    profitLossPercent: -18.55,
    maturityDate: null,
    risk: "high"
  }
];

const Investments = () => {
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);
  const [investmentsList, setInvestmentsList] = useState(investments);
  const [showReports, setShowReports] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState<any>(null);
  const [viewingInvestment, setViewingInvestment] = useState<any>(null);
  const { toast } = useToast();
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed_income':
        return 'Renda Fixa';
      case 'fund':
        return 'Fundos';
      case 'stock':
        return 'Ações';
      case 'treasury':
        return 'Tesouro';
      case 'crypto':
        return 'Cripto';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fixed_income':
        return 'bg-success/10 text-success';
      case 'fund':
        return 'bg-primary/10 text-primary';
      case 'stock':
        return 'bg-warning/10 text-warning';
      case 'treasury':
        return 'bg-secondary/10 text-secondary';
      case 'crypto':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-success/10 text-success';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'high':
        return 'bg-destructive/10 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Baixo';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto';
      default:
        return risk;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sem vencimento';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCreateInvestment = (investment: any) => {
    const newInvestment = {
      ...investment,
      id: Math.max(...investmentsList.map(i => i.id)) + 1
    };
    setInvestmentsList([...investmentsList, newInvestment]);
  };

  const handleUpdateInvestment = (updatedInvestment: any) => {
    setInvestmentsList(investmentsList.map(i => 
      i.id === updatedInvestment.id ? updatedInvestment : i
    ));
    setEditingInvestment(null);
  };

  const handleEditInvestment = (investment: any) => {
    setEditingInvestment(investment);
    setShowInvestmentForm(true);
  };

  const handleDeleteInvestment = (investmentId: number) => {
    const investment = investmentsList.find(inv => inv.id === investmentId);
    setInvestmentToDelete(investment);
    setShowDeleteDialog(true);
  };

  const confirmDeleteInvestment = () => {
    if (investmentToDelete) {
      setInvestmentsList(investmentsList.filter(investment => investment.id !== investmentToDelete.id));
      toast({
        title: "Investimento removido",
        description: "O investimento foi removido com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setInvestmentToDelete(null);
    }
  };

  const handleViewInvestment = (investment: any) => {
    setViewingInvestment(investment);
  };

  const totalInvested = investmentsList.reduce((sum, inv) => sum + inv.investedValue, 0);
  const totalCurrent = investmentsList.reduce((sum, inv) => sum + inv.currentValue, 0);
  const totalProfitLoss = totalCurrent - totalInvested;
  const totalProfitLossPercent = (totalProfitLoss / totalInvested) * 100;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Investimentos
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua carteira de investimentos
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => setShowReports(true)}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Relatórios</span>
            </Button>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setShowInvestmentForm(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Novo Investimento</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalInvested)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Valor Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(totalCurrent)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Lucro/Prejuízo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(totalProfitLoss)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rentabilidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center ${totalProfitLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                {totalProfitLossPercent >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                {Math.abs(totalProfitLossPercent).toFixed(2)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Distribuição da Carteira</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                investmentsList.reduce((acc, inv) => {
                  const type = getTypeLabel(inv.type);
                  acc[type] = (acc[type] || 0) + inv.currentValue;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([type, value]) => {
                const percentage = (value / totalCurrent) * 100;
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{type}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(value)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Investments List */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Investimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investmentsList.map((investment) => (
                <div 
                  key={investment.id} 
                  className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {investment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {investment.institution}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-foreground">
                          {formatCurrency(investment.currentValue)}
                        </p>
                        <p className={`text-xs flex items-center ${
                          investment.profitLoss >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {investment.profitLoss >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {investment.profitLossPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getTypeColor(investment.type)}>
                          {getTypeLabel(investment.type)}
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(investment.risk)}>
                          Risco {getRiskLabel(investment.risk)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Vencimento: {formatDate(investment.maturityDate)}</span>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewInvestment(investment);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditInvestment(investment);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteInvestment(investment.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Reports Modal */}
        <Dialog open={showReports} onOpenChange={setShowReports}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Relatório de Investimentos</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Performance Geral */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Capital Investido</p>
                      <p className="text-lg font-semibold">{formatCurrency(totalInvested)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Atual</p>
                      <p className="text-lg font-semibold">{formatCurrency(totalCurrent)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ganho/Perda</p>
                      <p className={`text-lg font-semibold ${totalProfitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(totalProfitLoss)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rentabilidade</p>
                      <p className={`text-lg font-semibold ${totalProfitLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {totalProfitLossPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance por Tipo */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Tipo de Investimento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      investmentsList.reduce((acc, inv) => {
                        const type = getTypeLabel(inv.type);
                        if (!acc[type]) {
                          acc[type] = { invested: 0, current: 0, count: 0 };
                        }
                        acc[type].invested += inv.investedValue;
                        acc[type].current += inv.currentValue;
                        acc[type].count += 1;
                        return acc;
                      }, {} as Record<string, { invested: number; current: number; count: number }>)
                    ).map(([type, data]) => {
                      const profitLoss = data.current - data.invested;
                      const percentage = (profitLoss / data.invested) * 100;
                      return (
                        <div key={type} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-medium">{type}</h4>
                            <Badge variant="outline">{data.count} investimento(s)</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Investido</p>
                              <p className="font-semibold">{formatCurrency(data.invested)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Atual</p>
                              <p className="font-semibold">{formatCurrency(data.current)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Rentabilidade</p>
                              <p className={`font-semibold ${percentage >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {percentage.toFixed(2)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Melhores Performers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {investmentsList
                      .sort((a, b) => b.profitLossPercent - a.profitLossPercent)
                      .slice(0, 3)
                      .map((investment, index) => (
                        <div key={investment.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{investment.name}</p>
                              <p className="text-sm text-muted-foreground">{investment.institution}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(investment.currentValue)}</p>
                            <p className={`text-sm ${investment.profitLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                              {investment.profitLossPercent >= 0 ? '+' : ''}{investment.profitLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Diversificação */}
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Diversificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Por Tipo de Investimento</h4>
                      {Object.entries(
                        investmentsList.reduce((acc, inv) => {
                          const type = getTypeLabel(inv.type);
                          acc[type] = (acc[type] || 0) + inv.currentValue;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([type, value]) => {
                        const percentage = (value / totalCurrent) * 100;
                        return (
                          <div key={type} className="flex justify-between items-center py-2">
                            <span className="text-sm">{type}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-12 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Por Nível de Risco</h4>
                      {Object.entries(
                        investmentsList.reduce((acc, inv) => {
                          const risk = getRiskLabel(inv.risk);
                          acc[risk] = (acc[risk] || 0) + inv.currentValue;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([risk, value]) => {
                        const percentage = (value / totalCurrent) * 100;
                        return (
                          <div key={risk} className="flex justify-between items-center py-2">
                            <span className="text-sm">Risco {risk}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={percentage} className="w-20 h-2" />
                              <span className="text-sm font-medium w-12 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>

        {/* Investment Details Modal */}
        <Dialog open={!!viewingInvestment} onOpenChange={() => setViewingInvestment(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Investimento</DialogTitle>
            </DialogHeader>
            
            {viewingInvestment && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{viewingInvestment.name}</span>
                      <Badge variant="secondary" className={getTypeColor(viewingInvestment.type)}>
                        {getTypeLabel(viewingInvestment.type)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Instituição</p>
                        <p className="font-medium">{viewingInvestment.institution}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nível de Risco</p>
                        <Badge variant="outline" className={getRiskColor(viewingInvestment.risk)}>
                          Risco {getRiskLabel(viewingInvestment.risk)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Investido</p>
                        <p className="font-medium">{formatCurrency(viewingInvestment.investedValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Atual</p>
                        <p className="font-medium">{formatCurrency(viewingInvestment.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lucro/Prejuízo</p>
                        <p className={`font-medium ${viewingInvestment.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {formatCurrency(viewingInvestment.profitLoss)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rentabilidade</p>
                        <p className={`font-medium flex items-center ${viewingInvestment.profitLossPercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {viewingInvestment.profitLossPercent >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {viewingInvestment.profitLossPercent.toFixed(2)}%
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                        <p className="font-medium">{formatDate(viewingInvestment.maturityDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Investment Form Modal */}
        <InvestmentForm
          open={showInvestmentForm}
          onOpenChange={(open) => {
            setShowInvestmentForm(open);
            if (!open) setEditingInvestment(null);
          }}
          onSubmit={editingInvestment ? handleUpdateInvestment : handleCreateInvestment}
          initialData={editingInvestment}
          title={editingInvestment ? "Editar Investimento" : "Novo Investimento"}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteInvestment}
          title="Deletar Investimento"
          description="Tem certeza que deseja deletar este investimento?"
          itemName={investmentToDelete?.name}
        />
      </div>
    </MainLayout>
  );
};

export default Investments;