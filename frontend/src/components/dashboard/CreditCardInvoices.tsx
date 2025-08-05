import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/contexts/DataContext";
import { CreditCard, Calendar, DollarSign, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CreditCardInvoices = () => {
  const { creditCards, payCreditCardInvoice } = useData();
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handlePayInvoice = (creditCardId: string, amount: number, cardName: string) => {
    payCreditCardInvoice(creditCardId, amount);
    toast({
      title: "Fatura paga com sucesso!",
      description: `A fatura do ${cardName} foi paga e o valor foi debitado da sua conta.`,
    });
  };

  const pendingInvoices = creditCards.filter(card => 
    card.invoiceStatus === 'pending' && card.currentInvoice > 0
  );

  if (pendingInvoices.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Faturas de Cartão Pendentes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingInvoices.map((card) => {
            const daysUntilDue = getDaysUntilDue(card.nextDueDate);
            const isOverdue = daysUntilDue < 0;
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;

            return (
              <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{card.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {card.bank} •••• {card.lastDigits}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Vence em {formatDate(card.nextDueDate)}
                      </span>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          Vencida
                        </Badge>
                      )}
                      {isDueSoon && !isOverdue && (
                        <Badge variant="secondary" className="text-xs">
                          Vence em breve
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {formatCurrency(card.currentInvoice)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mín: {formatCurrency(card.minimumPayment)}
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePayInvoice(card.id, card.minimumPayment, card.name)}
                    >
                      Pagar Mínimo
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePayInvoice(card.id, card.currentInvoice, card.name)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pagar Total
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};