import { useState } from "react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { CreditCardForm } from "@/components/forms/CreditCardForm";
import CreditCardDetailsModal from "@/components/modals/CreditCardDetailsModal";
import { Plus, MoreHorizontal, CreditCard, Eye, Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const CreditCards = () => {
  const [creditCards, setCreditCards] = useState<CreditCard[]>([
    {
      id: 1,
      name: "Cartão Empresarial Principal",
      bank: "Banco do Brasil",
      brand: "visa",
      lastDigits: "1234",
      totalLimit: 50000,
      usedLimit: 15000,
      availableLimit: 35000,
      closingDay: 15,
      dueDay: 10,
      annualFee: 120,
      isActive: true,
      currentInvoice: 2850.50,
      nextDueDate: "2024-08-10"
    },
    {
      id: 2,
      name: "Cartão Compras Online",
      bank: "Nubank",
      brand: "mastercard",
      lastDigits: "5678",
      totalLimit: 25000,
      usedLimit: 8500,
      availableLimit: 16500,
      closingDay: 20,
      dueDay: 15,
      annualFee: 0,
      isActive: true,
      currentInvoice: 1250.80,
      nextDueDate: "2024-08-15"
    },
    {
      id: 3,
      name: "Cartão Viagens",
      bank: "Itaú",
      brand: "visa",
      lastDigits: "9012",
      totalLimit: 30000,
      usedLimit: 5200,
      availableLimit: 24800,
      closingDay: 5,
      dueDay: 25,
      annualFee: 300,
      isActive: false,
      currentInvoice: 0,
      nextDueDate: "2024-08-25"
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<CreditCard | null>(null);
  const { toast } = useToast();

  const getBrandIcon = (brand: string) => {
    return CreditCard;
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'visa': return 'text-blue-600';
      case 'mastercard': return 'text-red-600';
      case 'elo': return 'text-yellow-600';
      case 'amex': return 'text-green-600';
      default: return 'text-gray-600';
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

  const handleAddCard = (cardData: any) => {
    const newCard: CreditCard = {
      id: Math.max(...creditCards.map(c => c.id)) + 1,
      ...cardData,
      availableLimit: cardData.totalLimit - (cardData.usedLimit || 0),
      currentInvoice: cardData.usedLimit || 0,
      nextDueDate: "2024-08-15"
    };
    setCreditCards([...creditCards, newCard]);
    toast({
      title: "Cartão cadastrado",
      description: "O cartão foi cadastrado com sucesso.",
    });
  };

  const handleEditCard = (cardData: any) => {
    setCreditCards(creditCards.map(card => 
      card.id === editingCard?.id 
        ? { ...card, ...cardData, availableLimit: cardData.totalLimit - (cardData.usedLimit || 0) }
        : card
    ));
    setEditingCard(null);
    toast({
      title: "Cartão atualizado",
      description: "Os dados do cartão foram atualizados com sucesso.",
    });
  };

  const handleDeleteCard = (cardId: number) => {
    const card = creditCards.find(c => c.id === cardId);
    setCardToDelete(card || null);
    setShowDeleteDialog(true);
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      setCreditCards(creditCards.filter(card => card.id !== cardToDelete.id));
      toast({
        title: "Cartão removido",
        description: "O cartão foi removido com sucesso.",
        variant: "destructive"
      });
      setShowDeleteDialog(false);
      setCardToDelete(null);
    }
  };

  const openEditForm = (card: CreditCard) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const openDetails = (card: CreditCard) => {
    setSelectedCard(card);
    setIsDetailsOpen(true);
  };

  const totalLimits = creditCards.reduce((sum, card) => sum + card.totalLimit, 0);
  const totalUsed = creditCards.reduce((sum, card) => sum + card.usedLimit, 0);
  const totalAvailable = creditCards.reduce((sum, card) => sum + card.availableLimit, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h1>
            <p className="text-muted-foreground">
              Gerencie os cartões de crédito da empresa
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cartão
          </Button>
        </div>

        {/* Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Limite Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalLimits)}</div>
              <p className="text-xs text-muted-foreground">
                {creditCards.length} cartões ativos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilizado</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalUsed)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalUsed / totalLimits) * 100).toFixed(1)}% do limite
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponível</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalAvailable)}</div>
              <p className="text-xs text-muted-foreground">
                Limite disponível
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Cartões */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {creditCards.map((card) => (
            <Card key={card.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <CreditCard className={`h-5 w-5 ${getBrandColor(card.brand)}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{card.name}</CardTitle>
                      <CardDescription>
                        {card.bank} •••• {card.lastDigits}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openDetails(card)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditForm(card)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={card.isActive ? "default" : "secondary"}>
                    {card.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                  <Badge variant="outline" className="uppercase">
                    {card.brand}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Limite utilizado</span>
                      <span>{formatCurrency(card.usedLimit)} / {formatCurrency(card.totalLimit)}</span>
                    </div>
                    <Progress 
                      value={(card.usedLimit / card.totalLimit) * 100} 
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fatura atual</span>
                      <p className="font-semibold">{formatCurrency(card.currentInvoice)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vencimento</span>
                      <p className="font-semibold">{formatDate(card.nextDueDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modais */}
        <CreditCardForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={editingCard ? handleEditCard : handleAddCard}
          initialData={editingCard}
          title={editingCard ? "Editar Cartão" : "Novo Cartão"}
        />

        <CreditCardDetailsModal
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          creditCard={selectedCard}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteCard}
          title="Deletar Cartão"
          description="Tem certeza que deseja deletar este cartão de crédito?"
          itemName={cardToDelete?.name}
        />
      </div>
    </MainLayout>
  );
};

export default CreditCards;