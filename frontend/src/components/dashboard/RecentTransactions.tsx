import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  CreditCard, 
  Building2 
} from "lucide-react";
import { Link } from "react-router-dom";

export const RecentTransactions = () => {
  const { transactions, accounts, creditCards } = useData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const recentTransactions = transactions.slice(0, 5);

  const getTransactionSource = (transaction: any) => {
    if (transaction.accountId) {
      const account = accounts.find(acc => acc.id === transaction.accountId);
      return account ? `${account.name} - ${account.bank}` : 'Conta';
    }
    if (transaction.creditCardId) {
      const card = creditCards.find(cc => cc.id === transaction.creditCardId);
      return card ? `${card.name} - ${card.bank}` : 'Cartão';
    }
    return 'Origem desconhecida';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Salário': 'bg-green-100 text-green-800',
      'Transferência': 'bg-blue-100 text-blue-800',
      'Alimentação': 'bg-orange-100 text-orange-800',
      'Combustível': 'bg-purple-100 text-purple-800',
      'Equipamentos': 'bg-indigo-100 text-indigo-800',
      'Software': 'bg-cyan-100 text-cyan-800',
      'Veículo': 'bg-red-100 text-red-800',
      'Utilidades': 'bg-yellow-100 text-yellow-800',
      'Pagamento Cartão': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm">{transaction.description}</h4>
                    {transaction.installments && (
                      <Badge variant="outline" className="text-xs">
                        {transaction.installments.current}/{transaction.installments.total}x
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)} • {getTransactionSource(transaction)}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs mt-1 ${getCategoryColor(transaction.category)}`}
                  >
                    {transaction.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-semibold ${
                  transaction.type === 'credit' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : ''}{formatCurrency(transaction.amount)}
                </span>
                {transaction.installments && (
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(transaction.installments.installmentValue)}/mês
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t">
          <Button asChild variant="outline" className="w-full">
            <Link to="/transactions">
              Ver todas as transações
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};