import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { CreditCardInvoices } from "@/components/dashboard/CreditCardInvoices";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
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
  
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Função para obter saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Pegar apenas o primeiro nome
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
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
        {/* Saudação Personalizada */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getGreeting()}, {user?.name ? getFirstName(user.name) : ''}! 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Aqui está um resumo das suas finanças hoje
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Header */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Dashboard Financeiro
          </h2>
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
