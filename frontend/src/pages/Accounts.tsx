import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Building2, 
  Wallet, 
  PiggyBank, 
  Plus, 
  Eye, 
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  FileText,
  CheckSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountForm } from "@/components/forms/AccountForm";
import AccountDetailsModal from "@/components/modals/AccountDetailsModal";
import { useToast } from "@/hooks/use-toast";

// Mock data - em um sistema real viria da API
const accounts = [
  {
    id: 1,
    name: "Conta Corrente Principal",
    type: "checking",
    bank: "Banco do Brasil",
    balance: 8450.80,
    accountNumber: "12345-6",
    isActive: true,
    lastTransaction: "2024-08-04",
    monthlyChange: 5.2
  },
  {
    id: 2,
    name: "Poupança Emergência",
    type: "savings", 
    bank: "Itaú",
    balance: 15200.00,
    accountNumber: "98765-4",
    isActive: true,
    lastTransaction: "2024-08-03",
    monthlyChange: 2.1
  },
  {
    id: 3,
    name: "Conta Empresa",
    type: "business",
    bank: "Santander",
    balance: 23100.45,
    accountNumber: "55544-3",
    isActive: true,
    lastTransaction: "2024-08-04",
    monthlyChange: -3.7
  },
  {
    id: 4,
    name: "Carteira Digital",
    type: "digital",
    bank: "PicPay",
    balance: 450.25,
    accountNumber: "***-1234",
    isActive: true,
    lastTransaction: "2024-08-02",
    monthlyChange: 12.3
  },
  {
    id: 5,
    name: "Conta Antiga",
    type: "checking",
    bank: "Caixa",
    balance: 0.00,
    accountNumber: "77788-9",
    isActive: false,
    lastTransaction: "2024-06-15",
    monthlyChange: 0
  }
];

const Accounts = () => {
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [accountsList, setAccountsList] = useState(accounts);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<any>(null);
  const { toast } = useToast();
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
        return 'Corrente';
      case 'savings':
        return 'Poupança';
      case 'business':
        return 'Empresarial';
      case 'digital':
        return 'Digital';
      default:
        return type;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'bg-primary/10 text-primary';
      case 'savings':
        return 'bg-success/10 text-success';
      case 'business':
        return 'bg-warning/10 text-warning';
      case 'digital':
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleCreateAccount = (account: any) => {
    const newAccount = {
      ...account,
      id: Math.max(...accountsList.map(a => a.id)) + 1
    };
    setAccountsList([...accountsList, newAccount]);
  };

  const handleUpdateAccount = (updatedAccount: any) => {
    setAccountsList(accountsList.map(a => 
      a.id === updatedAccount.id ? updatedAccount : a
    ));
    setEditingAccount(null);
  };

  const handleEditAccount = (account: any) => {
    setEditingAccount(account);
    setShowAccountForm(true);
  };

  const handleViewAccount = (account: any) => {
    setSelectedAccount(account);
    setShowAccountDetails(true);
  };

  const handleDeleteAccount = (accountId: number) => {
    const account = accountsList.find(acc => acc.id === accountId);
    setAccountToDelete(account);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAccount = () => {
    if (accountToDelete) {
      setAccountsList(accountsList.filter(account => account.id !== accountToDelete.id));
      toast({
        title: "Conta removida",
        description: "A conta foi removida com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setAccountToDelete(null);
    }
  };

  const totalBalance = accountsList
    .filter(account => account.isActive)
    .reduce((sum, account) => sum + account.balance, 0);

  const activeAccounts = accountsList.filter(acc => acc.isActive).length;
  const totalBanks = new Set(accountsList.filter(acc => acc.isActive).map(acc => acc.bank)).size;

  // Funções para as ações rápidas
  const handleTransfer = () => {
    const activeAccounts = accountsList.filter(acc => acc.isActive);
    if (activeAccounts.length < 2) {
      toast({
        title: "Transferência não disponível",
        description: "É necessário ter pelo menos 2 contas ativas para realizar transferências.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Nova Transferência",
      description: `Você pode transferir entre ${activeAccounts.length} contas ativas.`,
    });
  };

  const handleStatement = () => {
    const activeAccounts = accountsList.filter(acc => acc.isActive);
    if (activeAccounts.length === 0) {
      toast({
        title: "Nenhuma conta ativa",
        description: "É necessário ter pelo menos uma conta ativa para gerar extratos.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Gerar Extrato",
      description: `${activeAccounts.length} contas disponíveis para geração de extrato.`,
    });
  };

  const handleReconciliation = () => {
    const accountsWithTransactions = accountsList.filter(acc => acc.isActive && acc.balance > 0);
    if (accountsWithTransactions.length === 0) {
      toast({
        title: "Conciliação não disponível",
        description: "É necessário ter contas com movimentações para realizar a conciliação.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Conciliação Bancária",
      description: `${accountsWithTransactions.length} contas com saldo disponíveis para conciliação.`,
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Contas Bancárias
            </h1>
            <p className="text-muted-foreground">
              Gerencie todas as suas contas em um só lugar
            </p>
          </div>
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setShowAccountForm(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Conta</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(totalBalance)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contas Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {activeAccounts}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Instituições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {totalBanks}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Contas Inativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">
                {accountsList.length - activeAccounts}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountsList.map((account) => {
            const Icon = getAccountIcon(account.type);
            
            return (
              <Card 
                key={account.id} 
                className={`transition-all hover:shadow-lg hover:scale-[1.02] ${
                  !account.isActive ? 'opacity-60 grayscale' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${account.isActive ? 'bg-primary/10' : 'bg-muted'}`}>
                        <Icon className={`h-5 w-5 ${account.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm">
                          {account.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {account.bank}
                        </p>
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewAccount(account)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAccount(account.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Balance */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Saldo Atual</p>
                    <p className="text-xl font-bold text-foreground">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  
                  {/* Monthly Change */}
                  {account.monthlyChange !== 0 && (
                    <div className="flex items-center space-x-1">
                      {account.monthlyChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-success" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      <span className={`text-xs font-medium ${
                        account.monthlyChange > 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {account.monthlyChange > 0 ? '+' : ''}{account.monthlyChange}% este mês
                      </span>
                    </div>
                  )}
                  
                  {/* Account Info */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={getAccountTypeColor(account.type)}
                      >
                        {getAccountTypeLabel(account.type)}
                      </Badge>
                      {!account.isActive && (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inativa
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Conta: {account.accountNumber}</span>
                    <span>Última movimentação: {formatDate(account.lastTransaction)}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setShowAccountForm(true)}
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs">Nova Conta</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                onClick={handleTransfer}
              >
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                <span className="text-xs font-medium">Transferência</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-secondary/5 hover:border-secondary/20 transition-colors"
                onClick={handleStatement}
              >
                <FileText className="h-5 w-5 text-secondary" />
                <span className="text-xs font-medium">Extrato</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-success/5 hover:border-success/20 transition-colors"
                onClick={handleReconciliation}
              >
                <CheckSquare className="h-5 w-5 text-success" />
                <span className="text-xs font-medium">Conciliação</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Form Modal */}
        <AccountForm
          open={showAccountForm}
          onOpenChange={(open) => {
            setShowAccountForm(open);
            if (!open) setEditingAccount(null);
          }}
          onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}
          initialData={editingAccount}
          title={editingAccount ? "Editar Conta" : "Nova Conta"}
        />

        {/* Account Details Modal */}
        <AccountDetailsModal
          open={showAccountDetails}
          onOpenChange={setShowAccountDetails}
          account={selectedAccount}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteAccount}
          title="Deletar Conta"
          description="Tem certeza que deseja deletar esta conta bancária?"
          itemName={accountToDelete?.name}
        />
      </div>
    </MainLayout>
  );
};

export default Accounts;