import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { CreditCardInvoices } from "@/components/dashboard/CreditCardInvoices";
import { useData } from "@/contexts/DataContext";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  CreditCard,
  Target
} from "lucide-react";

const Index = () => {
  const { 
    getTotalBalance, 
    getTotalCreditCardDebt, 
    getMonthlyIncome, 
    getMonthlyExpenses,
    getNetWorth
  } = useData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const monthlyIncome = getMonthlyIncome();
  const monthlyExpenses = getMonthlyExpenses();
  const netProfit = monthlyIncome - monthlyExpenses;
  const totalBalance = getTotalBalance();
  const creditCardDebt = getTotalCreditCardDebt();
  const netWorth = getNetWorth();

  const changeType = netProfit > 0 ? "positive" : "negative";
  
  const stats = [
    {
      title: "Saldo Total",
      value: formatCurrency(totalBalance),
      change: "+2.5%",
      changeType: "positive" as const,
      icon: Wallet
    },
    {
      title: "Receitas do Mês",
      value: formatCurrency(monthlyIncome),
      change: "+12.3%",
      changeType: "positive" as const,
      icon: TrendingUp
    },
    {
      title: "Despesas do Mês",
      value: formatCurrency(monthlyExpenses),
      change: "-5.2%",
      changeType: "positive" as const,
      icon: TrendingDown
    },
    {
      title: "Lucro Líquido",
      value: formatCurrency(netProfit),
      change: netProfit > 0 ? "+18.7%" : "-8.3%",
      changeType: (netProfit > 0 ? "positive" : "negative") as "positive" | "negative",
      icon: DollarSign
    },
    {
      title: "Dívida Cartões",
      value: formatCurrency(creditCardDebt),
      change: "-8.1%",
      changeType: "positive" as const,
      icon: CreditCard
    },
    {
      title: "Patrimônio Líquido",
      value: formatCurrency(netWorth),
      change: "+5.2%",
      changeType: "positive" as const,
      icon: Target
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Página de Dashboard */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground">
            Visão geral das suas finanças pessoais e empresariais
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Seção de Faturas de Cartão */}
        <CreditCardInvoices />

        {/* Seção de Ações e Transações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
