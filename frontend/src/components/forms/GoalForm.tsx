import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: {
    id?: number;
    name: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: string;
    priority: string;
    monthlyContribution: number;
  };
  title: string;
}

const GoalForm = ({ open, onOpenChange, onSubmit, initialData, title }: GoalFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    targetAmount: initialData?.targetAmount || 0,
    currentAmount: initialData?.currentAmount || 0,
    targetDate: initialData?.targetDate || "",
    category: initialData?.category || "",
    priority: initialData?.priority || "medium",
    monthlyContribution: initialData?.monthlyContribution || 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.targetAmount <= 0 || !formData.targetDate || !formData.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const targetDate = new Date(formData.targetDate);
    const today = new Date();
    
    if (targetDate <= today) {
      toast({
        title: "Erro",
        description: "A data da meta deve ser futura",
        variant: "destructive",
      });
      return;
    }

    const goal = {
      ...initialData,
      ...formData,
      id: initialData?.id || Date.now(),
      status: "active"
    };

    onSubmit(goal);
    onOpenChange(false);

    if (!initialData) {
      setFormData({
        name: "",
        description: "",
        targetAmount: 0,
        currentAmount: 0,
        targetDate: "",
        category: "",
        priority: "medium",
        monthlyContribution: 0
      });
    }

    toast({
      title: "Sucesso",
      description: initialData ? "Meta atualizada com sucesso!" : "Nova meta criada com sucesso!",
    });
  };

  const categories = [
    { value: "emergency", label: "Emergência" },
    { value: "house", label: "Casa" },
    { value: "vehicle", label: "Veículo" },
    { value: "education", label: "Educação" },
    { value: "travel", label: "Viagem" },
    { value: "retirement", label: "Aposentadoria" },
    { value: "investment", label: "Investimento" },
    { value: "other", label: "Outros" }
  ];

  const priorities = [
    { value: "high", label: "Alta" },
    { value: "medium", label: "Média" },
    { value: "low", label: "Baixa" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(85vh-8rem)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Meta *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Casa própria"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva sua meta financeira"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Valor da Meta *</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentAmount">Valor Atual</Label>
            <Input
              id="currentAmount"
              type="number"
              step="0.01"
              min="0"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate">Data da Meta *</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyContribution">Contribuição Mensal</Label>
            <Input
              id="monthlyContribution"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthlyContribution}
              onChange={(e) => setFormData({ ...formData, monthlyContribution: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'} Meta
            </Button>
          </div>
        </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;