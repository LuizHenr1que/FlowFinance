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
  TrendingDown,
  Calendar,
  DollarSign,
  Receipt,
  CreditCard,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface InvoiceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  creditCard: CreditCard | null;
}

const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  open,
  onOpenChange,
  creditCard,
}) => {
  const { toast } = useToast();

  if (!creditCard) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Mock de todas as transações da fatura
  const allTransactions: Transaction[] = [
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
    },
    {
      id: 6,
      date: "2024-07-28",
      description: "Restaurante Italiano",
      amount: -320.80,
      category: "Alimentação"
    },
    {
      id: 7,
      date: "2024-07-25",
      description: "Compras Material Escritório",
      amount: -450.20,
      category: "Escritório"
    },
    {
      id: 8,
      date: "2024-07-22",
      description: "Manutenção Veículo",
      amount: -1200.00,
      category: "Manutenção"
    },
    {
      id: 9,
      date: "2024-07-20",
      description: "Curso Online Udemy",
      amount: -299.90,
      category: "Educação"
    },
    {
      id: 10,
      date: "2024-07-18",
      description: "Hotel Business Trip",
      amount: -800.00,
      category: "Viagem"
    }
  ];

  const handleDownloadInvoice = () => {
    toast({
      title: "Download iniciado",
      description: "A fatura está sendo baixada em PDF.",
    });
  };

  const handleEmailInvoice = () => {
    toast({
      title: "E-mail enviado",
      description: "A fatura foi enviada para seu e-mail cadastrado.",
    });
  };

  const totalAmount = allTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <span>Fatura Completa</span>
              <p className="text-sm font-normal text-muted-foreground">
                {creditCard.name} - {creditCard.bank} •••• {creditCard.lastDigits}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo da Fatura */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Valor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalAmount)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Vencimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  {formatDate(creditCard.nextDueDate)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-foreground">
                  {allTransactions.length} itens
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="text-warning">
                  Em aberto
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Ações da Fatura */}
          <Card>
            <CardHeader>
              <CardTitle>Ações da Fatura</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleDownloadInvoice} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Baixar PDF</span>
                </Button>
                <Button onClick={handleEmailInvoice} variant="outline" className="flex items-center space-x-2">
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

export default InvoiceDetailsModal;