import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreditCardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (creditCard: any) => void;
  initialData?: any;
  title: string;
}

export const CreditCardForm = ({ open, onOpenChange, onSubmit, initialData, title }: CreditCardFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    bank: initialData?.bank || '',
    brand: initialData?.brand || 'visa',
    lastDigits: initialData?.lastDigits || '',
    totalLimit: initialData?.totalLimit?.toString() || '0',
    usedLimit: initialData?.usedLimit?.toString() || '0',
    closingDay: initialData?.closingDay?.toString() || '5',
    dueDay: initialData?.dueDay?.toString() || '10',
    annualFee: initialData?.annualFee?.toString() || '0',
    isActive: initialData?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const creditCard = {
      ...initialData,
      ...formData,
      totalLimit: parseFloat(formData.totalLimit),
      usedLimit: parseFloat(formData.usedLimit),
      closingDay: parseInt(formData.closingDay),
      dueDay: parseInt(formData.dueDay),
      annualFee: parseFloat(formData.annualFee)
    };

    onSubmit(creditCard);
    onOpenChange(false);
    
    if (!initialData) {
      setFormData({
        name: '',
        bank: '',
        brand: 'visa',
        lastDigits: '',
        totalLimit: '0',
        usedLimit: '0',
        closingDay: '5',
        dueDay: '10',
        annualFee: '0',
        isActive: true
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
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Cartão Empresarial Principal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Banco</Label>
              <Input
                id="bank"
                value={formData.bank}
                onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
                placeholder="Ex: Banco do Brasil"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Bandeira</Label>
              <Select value={formData.brand} onValueChange={(value) => setFormData(prev => ({ ...prev, brand: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="elo">Elo</SelectItem>
                  <SelectItem value="amex">American Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastDigits">Últimos 4 Dígitos</Label>
            <Input
              id="lastDigits"
              value={formData.lastDigits}
              onChange={(e) => setFormData(prev => ({ ...prev, lastDigits: e.target.value }))}
              placeholder="1234"
              maxLength={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalLimit">Limite Total</Label>
              <Input
                id="totalLimit"
                type="number"
                step="0.01"
                value={formData.totalLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, totalLimit: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="usedLimit">Limite Utilizado</Label>
              <Input
                id="usedLimit"
                type="number"
                step="0.01"
                value={formData.usedLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, usedLimit: e.target.value }))}
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closingDay">Dia do Fechamento</Label>
              <Select value={formData.closingDay} onValueChange={(value) => setFormData(prev => ({ ...prev, closingDay: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDay">Dia do Vencimento</Label>
              <Select value={formData.dueDay} onValueChange={(value) => setFormData(prev => ({ ...prev, dueDay: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                    <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annualFee">Taxa Anual</Label>
            <Input
              id="annualFee"
              type="number"
              step="0.01"
              value={formData.annualFee}
              onChange={(e) => setFormData(prev => ({ ...prev, annualFee: e.target.value }))}
              placeholder="0,00"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Cartão ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'} Cartão
            </Button>
          </div>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};