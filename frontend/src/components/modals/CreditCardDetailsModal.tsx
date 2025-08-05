import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  Building2,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  ExternalLink,
  CreditCardIcon,
  Receipt,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InvoiceDetailsModal from "./InvoiceDetailsModal";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  installments?: {
    current: number;
    total: number;
  };
  category: string;
}

interface CreditCard {
  id: number;
  name: string;
  bank: string;
  brand: 'visa' | 'mastercard' | 'elo' | 'amex';
  lastDigits: string;
  totalLimit: number;
  usedLimit: number;
  availableLimit: number;
  closingDay: number;
  dueDay: number;
  annualFee: number;
  isActive: boolean;
  currentInvoice: number;
  nextDueDate: string;
}

interface CreditCardDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditCard: CreditCard | null;
}

const CreditCardDetailsModal: React.FC<CreditCardDetailsModalProps> = ({
  open,
  onOpenChange,
  creditCard,
}) => {
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const { toast } = useToast();

  if (!creditCard) return null;

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'visa': return 'text-blue-600';
      case 'mastercard': return 'text-red-600';
      case 'elo': return 'text-yellow-600';
      case 'amex': return 'text-green-600';
      default: return 'text-gray-600';
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

  // Mock das últimas transações do cartão
  const recentTransactions: Transaction[] = [
    {
      id: 1,
      date: "2024-08-04",
      description: "Supermercado Extra",
      amount: -280.50,
      category: "Alimentação"
    },
    {
      id: 2,
      date: "2024-08-03",
      description: "Posto de Gasolina Shell",
      amount: -350.00,
      category: "Combustível"
    },
    {
      id: 3,
      date: "2024-08-02",
      description: "Compra Veículo - Concessionária",
      amount: -45000.00,
      installments: { current: 1, total: 48 },
      category: "Veículo"
    },
    {
      id: 4,
      date: "2024-08-01",
      description: "Notebook Dell",
      amount: -3200.00,
      installments: { current: 1, total: 12 },
      category: "Equipamentos"
    },
    {
      id: 5,
      date: "2024-07-30",
      description: "Software Microsoft Office",
      amount: -890.00,
      installments: { current: 2, total: 6 },
      category: "Software"
    }
  ];

  const limitUsagePercentage = (creditCard.usedLimit / creditCard.totalLimit) * 100;

  const handleViewInvoice = () => {
    setIsInvoiceModalOpen(true);
  };

  const handleReports = () => {
    toast({
      title: "Relatórios",
      description: "Gerando relatório de gastos do cartão...",
    });
  };

  const handleInstallments = () => {
    toast({
      title: "Parcelamentos",
      description: "Visualizando parcelamentos em andamento...",
    });
  };

  const handleContactBank = () => {
    toast({
      title: "Contato do Banco",
      description: "Redirecionando para o atendimento do banco...",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className={`h-6 w-6 ${getBrandColor(creditCard.brand)}`} />
            </div>
            <div>
              <span>Detalhes do Cartão</span>
              <p className="text-sm font-normal text-muted-foreground">
                {creditCard.name} - {creditCard.bank} •••• {creditCard.lastDigits}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Limite Disponível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(creditCard.availableLimit)}
                </div>
                <div className="mt-2">
                  <Progress value={limitUsagePercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {limitUsagePercentage.toFixed(1)}% utilizado
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Receipt className="h-4 w-4 mr-1" />
                  Fatura Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(creditCard.currentInvoice)}
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Vence em {formatDate(creditCard.nextDueDate)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Status do Cartão
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={creditCard.isActive ? "default" : "secondary"}>
                    {creditCard.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline" className="uppercase">
                    {creditCard.brand}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Cartão */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cartão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Banco Emissor</label>
                    <p className="text-lg font-semibold">{creditCard.bank}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número Final</label>
                    <p className="text-lg font-semibold">•••• •••• •••• {creditCard.lastDigits}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Limite Total</label>
                    <p className="text-lg font-semibold">{formatCurrency(creditCard.totalLimit)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dia do Fechamento</label>
                    <p className="text-lg font-semibold">Todo dia {creditCard.closingDay}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Dia do Vencimento</label>
                    <p className="text-lg font-semibold">Todo dia {creditCard.dueDay}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Taxa Anual</label>
                    <p className="text-lg font-semibold">
                      {creditCard.annualFee > 0 ? formatCurrency(creditCard.annualFee) : "Isento"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transações Recentes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transações Recentes</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={handleViewInvoice}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ver Fatura Completa</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                          <TrendingDown className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{formatDate(transaction.date)}</span>
                            <span>•</span>
                            <span>{transaction.category}</span>
                            {transaction.installments && (
                              <>
                                <span>•</span>
                                <span>
                                  {transaction.installments.current}/{transaction.installments.total}x
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-destructive">
                          {formatCurrency(transaction.amount)}
                        </div>
                        {transaction.installments && (
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(transaction.amount / transaction.installments.total)}/mês
                          </div>
                        )}
                      </div>
                    </div>
                    {index < recentTransactions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={handleViewInvoice}
                >
                  <Receipt className="h-5 w-5" />
                  <span className="text-xs">Ver Fatura</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={handleReports}
                >
                  <PieChart className="h-5 w-5" />
                  <span className="text-xs">Relatórios</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={handleInstallments}
                >
                  <CreditCardIcon className="h-5 w-5" />
                  <span className="text-xs">Parcelamentos</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={handleContactBank}
                >
                  <Building2 className="h-5 w-5" />
                  <span className="text-xs">Contato Banco</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      <InvoiceDetailsModal
        open={isInvoiceModalOpen}
        onOpenChange={setIsInvoiceModalOpen}
        creditCard={creditCard}
      />
    </Dialog>
  );
};

export default CreditCardDetailsModal;