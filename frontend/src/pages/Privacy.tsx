import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-foreground">
                Política de Privacidade
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
                <h3 className="text-lg font-semibold text-foreground mb-3">1. Informações que Coletamos</h3>
                <p>
                  Coletamos as seguintes informações quando você utiliza nosso sistema:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Dados de cadastro (nome, email, telefone)</li>
                  <li>Informações financeiras inseridas voluntariamente</li>
                  <li>Dados de uso do sistema (logs de acesso, funcionalidades utilizadas)</li>
                  <li>Informações de dispositivo (IP, navegador, sistema operacional)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">2. Como Utilizamos suas Informações</h3>
                <p>
                  Suas informações são utilizadas para:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Personalizar sua experiência no sistema</li>
                  <li>Enviar notificações importantes sobre sua conta</li>
                  <li>Garantir a segurança e prevenir fraudes</li>
                  <li>Cumprir obrigações legais e regulamentares</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">3. Compartilhamento de Dados</h3>
                <p>
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Quando necessário para cumprir obrigações legais</li>
                  <li>Com provedores de serviços essenciais (sob rigorosos acordos de confidencialidade)</li>
                  <li>Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">4. Segurança dos Dados</h3>
                <p>
                  Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares e seguros</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">5. Seus Direitos</h3>
                <p>
                  Você tem os seguintes direitos sobre seus dados:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Acessar e visualizar suas informações</li>
                  <li>Corrigir dados incorretos ou incompletos</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Portabilidade de dados</li>
                  <li>Revogar consentimentos dados anteriormente</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">6. Cookies e Tecnologias Similares</h3>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do sistema e personalizar conteúdo.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">7. Retenção de Dados</h3>
                <p>
                  Mantemos seus dados pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais, geralmente por até 5 anos após o encerramento da conta.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-foreground mb-3">8. Contato</h3>
                <p>
                  Para exercer seus direitos ou esclarecer dúvidas sobre privacidade, entre em contato:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  <li>Email: privacidade@sistemafinanceiro.com</li>
                  <li>Telefone: (11) 99999-9999</li>
                  <li>Endereço: Rua da Privacidade, 123 - São Paulo, SP</li>
                </ul>
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

export default Privacy;