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
import { useToast } from "@/hooks/use-toast";
import AccountStatementModal from "./AccountStatementModal";
import {
  CreditCard,
  Building2,
  Wallet,
  PiggyBank,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  Clock,
  ExternalLink
} from "lucide-react";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
}

interface Account {
  id: number;
  name: string;
  type: string;
  bank: string;
  balance: number;
  accountNumber: string;
  isActive: boolean;
  lastTransaction: string;
  monthlyChange: number;
  openDate?: string;
  agency?: string;
  manager?: string;
  creditLimit?: number;
  monthlyFee?: number;
}

interface AccountDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({
  open,
  onOpenChange,
  account,
}) => {
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const { toast } = useToast();
  
  if (!account) return null;

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return CreditCard;
      case 'savings':
        return PiggyBank;
      case 'business':
        return Building2;
      case 'digital':
        return Wallet;
      default:
        return CreditCard;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Conta Corrente';
      case 'savings':
        return 'Poupança';
      case 'business':
        return 'Conta Empresarial';
      case 'digital':
        return 'Carteira Digital';
      default:
        return type;
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

  // Mock das últimas transações
  const recentTransactions: Transaction[] = [
    {
      id: 1,
      date: "2024-08-04",
      description: "Transferência PIX recebida",
      amount: 1500.00,
      type: 'credit',
      category: "Transferência"
    },
    {
      id: 2,
      date: "2024-08-04",
      description: "Compra no supermercado",
      amount: -250.80,
      type: 'debit',
      category: "Alimentação"
    },
    {
      id: 3,
      date: "2024-08-03",
      description: "Salário",
      amount: 5000.00,
      type: 'credit',
      category: "Salário"
    },
    {
      id: 4,
      date: "2024-08-03",
      description: "Conta de luz",
      amount: -185.45,
      type: 'debit',
      category: "Utilidades"
    },
    {
      id: 5,
      date: "2024-08-02",
      description: "Pagamento cartão",
      amount: -890.20,
      type: 'debit',
      category: "Cartão"
    }
  ];

  const Icon = getAccountIcon(account.type);

  const handleViewStatement = () => {
    setIsStatementModalOpen(true);
  };

  const handleTransfer = () => {
    toast({
      title: "Transferir",
      description: "Funcionalidade de transferência em desenvolvimento.",
    });
  };

  const handleSchedule = () => {
    toast({
      title: "Agendar",
      description: "Funcionalidade de agendamento em desenvolvimento.",
    });
  };

  const handleContactBank = () => {
    toast({
      title: "Contato Banco",
      description: "Redirecionando para contato com o banco.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span>Detalhes da Conta</span>
              <p className="text-sm font-normal text-muted-foreground">
                {account.name} - {account.bank}
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
                  Saldo Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(account.balance)}
                </div>
                {account.monthlyChange !== 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    {account.monthlyChange > 0 ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs ${
                      account.monthlyChange > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {account.monthlyChange > 0 ? '+' : ''}{account.monthlyChange}% este mês
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Status da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant={account.isActive ? "default" : "secondary"}>
                    {account.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                  <Badge variant="outline">
                    {getAccountTypeLabel(account.type)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Última Movimentação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {formatDate(account.lastTransaction)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações da Conta */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Banco</label>
                    <p className="text-lg font-semibold">{account.bank}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Número da Conta</label>
                    <p className="text-lg font-semibold">{account.accountNumber}</p>
                  </div>
                  {account.agency && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Agência</label>
                      <p className="text-lg font-semibold">{account.agency || "0001"}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {account.openDate && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Data de Abertura</label>
                      <p className="text-lg font-semibold">{formatDate(account.openDate || "2020-01-15")}</p>
                    </div>
                  )}
                  {account.manager && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Gerente</label>
                      <p className="text-lg font-semibold">{account.manager || "Maria Santos"}</p>
                    </div>
                  )}
                  {account.creditLimit && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Limite de Crédito</label>
                      <p className="text-lg font-semibold">{formatCurrency(account.creditLimit || 5000)}</p>
                    </div>
                  )}
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
                onClick={handleViewStatement}
              >
                <ExternalLink className="h-4 w-4" />
                <span>Ver Todas</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'credit' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{formatDate(transaction.date)}</span>
                            <span>•</span>
                            <span>{transaction.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                      }`}>
                        {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
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
                  onClick={handleViewStatement}
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="text-xs">Extrato Completo</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={handleTransfer}
                >
                  <Target className="h-5 w-5" />
                  <span className="text-xs">Transferir</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                  onClick={handleSchedule}
                >
                  <Calendar className="h-5 w-5" />
                  <span className="text-xs">Agendar</span>
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

      <AccountStatementModal
        open={isStatementModalOpen}
        onOpenChange={setIsStatementModalOpen}
        account={account}
      />
    </Dialog>
  );
};

export default AccountDetailsModal;