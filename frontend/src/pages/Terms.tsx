import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-foreground">
                Termos de Uso
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/register" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">1. Aceitação dos Termos</h3>
                <p>
                  Ao utilizar nosso sistema de gestão financeira, você concorda em cumprir e ficar vinculado aos presentes Termos de Uso.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">2. Descrição do Serviço</h3>
                <p>
                  Nosso sistema oferece ferramentas para gestão financeira pessoal e empresarial, incluindo controle de contas, transações, investimentos e relatórios.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">3. Responsabilidades do Usuário</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Manter a confidencialidade de suas credenciais de acesso</li>
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Utilizar o sistema de forma responsável e legal</li>
                  <li>Não compartilhar dados financeiros sensíveis com terceiros</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">4. Privacidade e Segurança</h3>
                <p>
                  Levamos a sério a proteção de seus dados financeiros. Implementamos medidas de segurança adequadas para proteger suas informações pessoais e financeiras.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">5. Limitações de Responsabilidade</h3>
                <p>
                  O sistema é fornecido "como está" e não nos responsabilizamos por decisões financeiras tomadas com base nas informações do sistema.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">6. Modificações dos Termos</h3>
                <p>
                  Reservamos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">7. Contato</h3>
                <p>
                  Para dúvidas sobre estes termos, entre em contato através do email: contato@sistemafinanceiro.com
                </p>
              </section>

              <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-center">
                  <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;