import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, ArrowDownLeft, Building2, CreditCard, Edit } from "lucide-react";

interface TransactionDetailsModalProps {
  transaction: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export const TransactionDetailsModal = ({ transaction, open, onOpenChange, onEdit }: TransactionDetailsModalProps) => {
  if (!transaction) return null;

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
        return "bg-success/10 text-success";
      case 'expense':
        return "bg-destructive/10 text-destructive";
      case 'transfer':
        return "bg-primary/10 text-primary";
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

  const Icon = getIcon(transaction.type);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalhes da Transação</span>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-6">
          <div className="space-y-6">
          {/* Header da transação */}
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-muted">
              <Icon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{transaction.description}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(transaction.date)}
              </p>
            </div>
          </div>

          {/* Valor */}
          <div className="text-center py-4 border rounded-lg bg-muted/20">
            <p className="text-sm text-muted-foreground mb-1">Valor</p>
            <p className={`text-3xl font-bold ${getAmountColor(transaction.amount)}`}>
              {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
            </p>
          </div>

          {/* Informações detalhadas */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Categoria</p>
                <Badge className={getTypeColor(transaction.type)}>
                  {transaction.category}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="outline" className={getStatusColor(transaction.status)}>
                  {transaction.status === 'completed' ? 'Concluída' : 
                   transaction.status === 'pending' ? 'Pendente' : 'Cancelada'}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Conta</p>
              <p className="font-medium">{transaction.account}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Tipo de Transação</p>
              <p className="font-medium">
                {transaction.type === 'income' ? 'Receita' :
                 transaction.type === 'expense' ? 'Despesa' : 'Transferência'}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">ID da Transação</p>
              <p className="font-mono text-sm">{transaction.id}</p>
            </div>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};