import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowUpRight, ArrowDownLeft, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TransactionForm } from "@/components/forms/TransactionForm";
import { toast } from "sonner";

const actions = [
  {
    label: "Nova Receita",
    icon: ArrowUpRight,
    variant: "default" as const,
    description: "Registrar entrada de dinheiro"
  },
  {
    label: "Nova Despesa", 
    icon: ArrowDownLeft,
    variant: "secondary" as const,
    description: "Registrar saída de dinheiro"
  },
  {
    label: "Criar Orçamento",
    icon: PieChart,
    variant: "outline" as const,
    description: "Planejar gastos mensais"
  },
  {
    label: "Adicionar Meta",
    icon: Plus,
    variant: "outline" as const,
    description: "Definir objetivo financeiro"
  }
];

export function QuickActions() {
  const navigate = useNavigate();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");

  const handleActionClick = (actionLabel: string) => {
    switch (actionLabel) {
      case "Nova Receita":
        setTransactionType("income");
        setTransactionModalOpen(true);
        break;
      case "Nova Despesa":
        setTransactionType("expense");
        setTransactionModalOpen(true);
        break;
      case "Criar Orçamento":
        navigate("/budgets");
        break;
      case "Adicionar Meta":
        navigate("/goals");
        break;
    }
  };

  const handleTransactionSubmit = (transaction: any) => {
    // Aqui você pode adicionar lógica para salvar a transação
    console.log("Nova transação:", transaction);
    toast.success("Transação criada com sucesso!");
    setTransactionModalOpen(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => handleActionClick(action.label)}
              >
                <action.icon className="h-5 w-5" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <TransactionForm
        open={transactionModalOpen}
        onOpenChange={setTransactionModalOpen}
        onSubmit={handleTransactionSubmit}
        title={transactionType === "income" ? "Nova Receita" : "Nova Despesa"}
        initialData={{ type: transactionType }}
      />
    </>
  );
}