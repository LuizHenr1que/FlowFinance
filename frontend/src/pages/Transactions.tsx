import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Plus, 
  Download,
  CreditCard,
  Building2,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { TransactionDetailsModal } from "@/components/modals/TransactionDetailsModal";
import { useToast } from "@/hooks/use-toast";

// Mock data - em um sistema real viria da API
const transactions = [
  {
    id: 1,
    description: "Salário - Empresa XYZ",
    amount: 5500.00,
    type: "income",
    category: "Salário",
    account: "Conta Corrente Principal",
    date: "2024-08-04T10:30:00",
    status: "completed"
  },
  {
    id: 2,
    description: "Supermercado ABC",
    amount: -245.80,
    type: "expense",
    category: "Alimentação",
    account: "Cartão de Crédito",
    date: "2024-08-03T15:45:00",
    status: "completed"
  },
  {
    id: 3,
    description: "Freelance - Projeto Web",
    amount: 1200.00,
    type: "income",
    category: "Freelance",
    account: "Conta Poupança",
    date: "2024-08-02T09:15:00",
    status: "completed"
  },
  {
    id: 4,
    description: "Conta de Luz - CEMIG",
    amount: -186.45,
    type: "expense",
    category: "Utilidades",
    account: "Conta Corrente Principal",
    date: "2024-08-01T14:20:00",
    status: "completed"
  },
  {
    id: 5,
    description: "Investimento CDB",
    amount: -1000.00,
    type: "transfer",
    category: "Investimentos",
    account: "Conta Corrente Principal",
    date: "2024-07-31T11:00:00",
    status: "completed"
  },
  {
    id: 6,
    description: "Restaurante Italiano",
    amount: -89.50,
    type: "expense",
    category: "Alimentação",
    account: "Cartão de Crédito",
    date: "2024-07-30T20:30:00",
    status: "pending"
  },
  {
    id: 7,
    description: "Venda de Produto Online",
    amount: 350.00,
    type: "income",
    category: "Vendas",
    account: "Carteira Digital",
    date: "2024-07-29T16:45:00",
    status: "completed"
  },
  {
    id: 8,
    description: "Combustível - Posto Shell",
    amount: -120.00,
    type: "expense",
    category: "Transporte",
    account: "Conta Corrente Principal",
    date: "2024-07-28T08:15:00",
    status: "completed"
  }
];

const Transactions = () => {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [transactionsList, setTransactionsList] = useState(transactions);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);
  const { toast } = useToast();
  const getIcon = (type: string) => {
    switch (type) {
      case 'income':
        return ArrowUpRight;
      case 'expense':
        return ArrowDownLeft;
      case 'transfer':
        return Building2;
      default:
        return CreditCard;
    }
  };

  const getAmountColor = (amount: number) => {
    if (amount > 0) return "text-success";
    return "text-destructive";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return "bg-success/10 text-success hover:bg-success/20";
      case 'expense':
        return "bg-destructive/10 text-destructive hover:bg-destructive/20";
      case 'transfer':
        return "bg-primary/10 text-primary hover:bg-primary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-success/10 text-success";
      case 'pending':
        return "bg-warning/10 text-warning";
      case 'cancelled':
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(amount));
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateTransaction = (transaction: any) => {
    const newTransaction = {
      ...transaction,
      id: Math.max(...transactionsList.map(t => t.id)) + 1
    };
    setTransactionsList([newTransaction, ...transactionsList]);
  };

  const handleUpdateTransaction = (updatedTransaction: any) => {
    setTransactionsList(transactionsList.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
  };

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetails(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
    setShowTransactionDetails(false);
  };

  const handleDeleteTransaction = (transactionId: number) => {
    const transaction = transactionsList.find(t => t.id === transactionId);
    setTransactionToDelete(transaction);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTransaction = () => {
    if (transactionToDelete) {
      setTransactionsList(transactionsList.filter(transaction => transaction.id !== transactionToDelete.id));
      toast({
        title: "Transação removida",
        description: "A transação foi removida com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setTransactionToDelete(null);
    }
  };

  const totalIncome = transactionsList
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalExpenses = transactionsList
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Transações
            </h1>
            <p className="text-muted-foreground">
              Histórico completo de movimentações financeiras
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setShowTransactionForm(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Nova Transação</span>
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Receitas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatAmount(totalIncome)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Despesas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatAmount(totalExpenses)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Líquido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatAmount(totalIncome - totalExpenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar transações..." 
                  className="pl-10"
                />
              </div>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Receitas</SelectItem>
                  <SelectItem value="expense">Despesas</SelectItem>
                  <SelectItem value="transfer">Transferências</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="salary">Salário</SelectItem>
                  <SelectItem value="food">Alimentação</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                  <SelectItem value="utilities">Utilidades</SelectItem>
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="year">Este ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactionsList.map((transaction) => {
                const Icon = getIcon(transaction.type);
                
                return (
                  <div 
                    key={transaction.id} 
                    className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="p-2 rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {transaction.description}
                        </p>
                        <span className={`text-sm font-semibold ${getAmountColor(transaction.amount)}`}>
                          {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className={getTypeColor(transaction.type)}>
                            {transaction.category}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(transaction.status)}>
                            {transaction.status === 'completed' ? 'Concluída' : 
                             transaction.status === 'pending' ? 'Pendente' : 'Cancelada'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {transaction.account}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(transaction.date)}
                        </span>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(transaction);
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
                              handleEditTransaction(transaction);
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
                              handleDeleteTransaction(transaction.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        <TransactionForm
          open={showTransactionForm}
          onOpenChange={(open) => {
            setShowTransactionForm(open);
            if (!open) setEditingTransaction(null);
          }}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          initialData={editingTransaction}
          title={editingTransaction ? "Editar Transação" : "Nova Transação"}
        />

        <TransactionDetailsModal
          transaction={selectedTransaction}
          open={showTransactionDetails}
          onOpenChange={setShowTransactionDetails}
          onEdit={() => handleEditTransaction(selectedTransaction)}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteTransaction}
          title="Deletar Transação"
          description="Tem certeza que deseja deletar esta transação?"
          itemName={transactionToDelete?.description}
        />
      </div>
    </MainLayout>
  );
};

export default Transactions;