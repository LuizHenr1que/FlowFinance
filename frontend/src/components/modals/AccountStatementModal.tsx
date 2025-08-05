import React from "react";
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
import {
  Download,
  Mail,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  FileText,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  balance: number;
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
}

interface AccountStatementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

const AccountStatementModal: React.FC<AccountStatementModalProps> = ({
  open,
  onOpenChange,
  account,
}) => {
  const { toast } = useToast();

  if (!account) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Mock de todas as transações do extrato
  const allTransactions: Transaction[] = [
    {
      id: 1,
      date: "2024-08-04",
      description: "Transferência PIX recebida",
      amount: 1500.00,
      type: 'credit',
      category: "Transferência",
      balance: 8450.80
    },
    {
      id: 2,
      date: "2024-08-04",
      description: "Compra no supermercado",
      amount: -250.80,
      type: 'debit',
      category: "Alimentação",
      balance: 6950.80
    },
    {
      id: 3,
      date: "2024-08-03",
      description: "Salário",
      amount: 5000.00,
      type: 'credit',
      category: "Salário",
      balance: 7201.60
    },
    {
      id: 4,
      date: "2024-08-03",
      description: "Conta de luz",
      amount: -185.45,
      type: 'debit',
      category: "Utilidades",
      balance: 2201.60
    },
    {
      id: 5,
      date: "2024-08-02",
      description: "Pagamento cartão",
      amount: -890.20,
      type: 'debit',
      category: "Cartão",
      balance: 2387.05
    },
    {
      id: 6,
      date: "2024-08-01",
      description: "Transferência para poupança",
      amount: -1000.00,
      type: 'debit',
      category: "Transferência",
      balance: 3277.25
    },
    {
      id: 7,
      date: "2024-07-31",
      description: "Recebimento de cliente",
      amount: 2500.00,
      type: 'credit',
      category: "Recebimento",
      balance: 4277.25
    },
    {
      id: 8,
      date: "2024-07-30",
      description: "Compra de material de escritório",
      amount: -350.75,
      type: 'debit',
      category: "Escritório",
      balance: 1777.25
    },
    {
      id: 9,
      date: "2024-07-29",
      description: "Taxa de manutenção",
      amount: -25.00,
      type: 'debit',
      category: "Taxa",
      balance: 2128.00
    },
    {
      id: 10,
      date: "2024-07-28",
      description: "Depósito em dinheiro",
      amount: 800.00,
      type: 'credit',
      category: "Depósito",
      balance: 2153.00
    }
  ];

  const handleDownloadStatement = () => {
    toast({
      title: "Download iniciado",
      description: "O extrato está sendo baixado em PDF.",
    });
  };

  const handleEmailStatement = () => {
    toast({
      title: "E-mail enviado",
      description: "O extrato foi enviado para seu e-mail cadastrado.",
    });
  };

  const totalCredit = allTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const totalDebit = allTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span>Extrato Completo</span>
              <p className="text-sm font-normal text-muted-foreground">
                {account.name} - {account.bank} - Conta: {account.accountNumber}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Extrato */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Total Entradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-success">
                  {formatCurrency(totalCredit)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Total Saídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-destructive">
                  {formatCurrency(totalDebit)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  {allTransactions.length} itens
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ações do Extrato */}
          <Card>
            <CardHeader>
              <CardTitle>Ações do Extrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleDownloadStatement} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Baixar PDF</span>
                </Button>
                <Button onClick={handleEmailStatement} variant="outline" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Enviar por E-mail</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista Completa de Transações */}
          <Card>
            <CardHeader>
              <CardTitle>Todas as Transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allTransactions.map((transaction, index) => (
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
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${
                          transaction.type === 'credit' ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Saldo: {formatCurrency(transaction.balance)}
                        </div>
                      </div>
                    </div>
                    {index < allTransactions.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountStatementModal;