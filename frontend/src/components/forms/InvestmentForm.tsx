import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InvestmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (investment: any) => void;
  initialData?: any;
  title: string;
}

export const InvestmentForm = ({ open, onOpenChange, onSubmit, initialData, title }: InvestmentFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || 'fixed_income',
    institution: initialData?.institution || '',
    investedValue: initialData?.investedValue?.toString() || '',
    currentValue: initialData?.currentValue?.toString() || '',
    maturityDate: initialData?.maturityDate ? new Date(initialData.maturityDate) : null,
    risk: initialData?.risk || 'low'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const investedValue = parseFloat(formData.investedValue);
    const currentValue = parseFloat(formData.currentValue);
    const profitLoss = currentValue - investedValue;
    const profitLossPercent = (profitLoss / investedValue) * 100;

    const investment = {
      ...initialData,
      ...formData,
      investedValue,
      currentValue,
      profitLoss,
      profitLossPercent,
      maturityDate: formData.maturityDate?.toISOString().split('T')[0] || null
    };

    onSubmit(investment);
    onOpenChange(false);
    
    if (!initialData) {
      setFormData({
        name: '',
        type: 'fixed_income',
        institution: '',
        investedValue: '',
        currentValue: '',
        maturityDate: null,
        risk: 'low'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Investimento</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: CDB Premium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed_income">Renda Fixa</SelectItem>
                  <SelectItem value="fund">Fundos</SelectItem>
                  <SelectItem value="stock">Ações</SelectItem>
                  <SelectItem value="treasury">Tesouro</SelectItem>
                  <SelectItem value="crypto">Criptomoedas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="risk">Risco</Label>
              <Select value={formData.risk} onValueChange={(value) => setFormData(prev => ({ ...prev, risk: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixo</SelectItem>
                  <SelectItem value="medium">Médio</SelectItem>
                  <SelectItem value="high">Alto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Instituição</Label>
            <Input
              id="institution"
              value={formData.institution}
              onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
              placeholder="Ex: Banco XYZ"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investedValue">Valor Investido</Label>
              <Input
                id="investedValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.investedValue}
                onChange={(e) => setFormData(prev => ({ ...prev, investedValue: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Valor Atual</Label>
              <Input
                id="currentValue"
                type="number"
                step="0.01"
                min="0"
                value={formData.currentValue}
                onChange={(e) => setFormData(prev => ({ ...prev, currentValue: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data de Vencimento (opcional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.maturityDate ? format(formData.maturityDate, "dd/MM/yyyy", { locale: ptBR }) : "Sem vencimento"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.maturityDate || undefined}
                  onSelect={(date) => setFormData(prev => ({ ...prev, maturityDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'} Investimento
            </Button>
          </div>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};