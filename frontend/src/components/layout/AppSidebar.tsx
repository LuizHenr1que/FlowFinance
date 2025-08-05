import { 
  LayoutDashboard, 
  CreditCard, 
  TrendingUp, 
  PieChart, 
  Target, 
  Settings,
  Building2,
  Users,
  Receipt,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mainItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Visão geral das finanças"
  },
  { 
    title: "Contas", 
    url: "/accounts", 
    icon: CreditCard,
    description: "Gerenciar contas bancárias"
  },
  { 
    title: "Cartões", 
    url: "/credit-cards", 
    icon: CreditCard,
    description: "Cartões de crédito"
  },
  { 
    title: "Transações", 
    url: "/transactions", 
    icon: Receipt,
    description: "Histórico de movimentações"
  },
  { 
    title: "Investimentos", 
    url: "/investments", 
    icon: TrendingUp,
    description: "Carteira de investimentos"
  },
];

const planningItems = [
  { 
    title: "Orçamentos", 
    url: "/budgets", 
    icon: PieChart,
    description: "Planejamento financeiro"
  },
  { 
    title: "Metas", 
    url: "/goals", 
    icon: Target,
    description: "Objetivos financeiros"
  },
];

const businessItems = [
  { 
    title: "Empresas", 
    url: "/companies", 
    icon: Building2,
    description: "Gestão empresarial"
  },
  { 
    title: "Equipe", 
    url: "/team", 
    icon: Users,
    description: "Usuários e permissões"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "w-full justify-start transition-all duration-200 ease-in-out rounded-lg mx-1 mb-1";
    return isActive(path) 
      ? `${baseClass} bg-primary text-primary-foreground shadow-sm hover:bg-primary/90` 
      : `${baseClass} hover:bg-accent hover:text-accent-foreground hover:shadow-sm`;
  };

  const SidebarSection = ({ 
    items, 
    label
  }: { 
    items: typeof mainItems; 
    label: string;
  }) => (
    <SidebarGroup className={isCollapsed ? "px-0" : "px-1"}>
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-2 mb-2">
        {!isCollapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {isCollapsed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild className="p-0 h-auto">
                        <NavLink to={item.url} className={`${getNavClass(item.url)} justify-center`}>
                          <div className="flex items-center justify-center min-h-[2.75rem] w-full">
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                          </div>
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      <p>{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <SidebarMenuButton asChild className="p-0 h-auto">
                  <NavLink to={item.url} className={getNavClass(item.url)}>
                    <div className="flex items-center min-h-[2.75rem] px-3 py-2 w-full">
                      <item.icon className="h-5 w-5 flex-shrink-0 mr-3" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm leading-tight truncate">{item.title}</span>
                        <span className="text-xs text-muted-foreground leading-tight truncate mt-0.5">
                          {item.description}
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar 
      className={`transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo/Brand */}
        <div className={`border-b border-border ${isCollapsed ? "p-4 flex justify-center" : "p-6"}`}>
          {isCollapsed ? (
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-bold text-sm">F</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-base">F</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">FinanceApp</h1>
                <p className="text-xs text-muted-foreground">Gestão Financeira</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <ScrollArea className="flex-1 px-2">
          <div className="py-6 space-y-6 pr-2">
            <SidebarSection items={mainItems} label="Principal" />
            <SidebarSection items={planningItems} label="Planejamento" />
            <SidebarSection items={businessItems} label="Empresarial" />
          </div>
        </ScrollArea>

        {/* Settings and Logout at bottom */}
        <div className={`py-4 border-t border-border space-y-3 ${isCollapsed ? "px-1" : "px-6"}`}>
          <SidebarMenu className="space-y-1">
            <SidebarMenuItem>
              {isCollapsed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild className="p-0 h-auto">
                        <NavLink to="/settings" className={`${getNavClass("/settings")} justify-center`}>
                          <div className="flex items-center justify-center min-h-[2.75rem] w-full">
                            <Settings className="h-5 w-5 flex-shrink-0" />
                          </div>
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      <p>Configurações</p>
                      <p className="text-xs text-muted-foreground">Preferências do sistema</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <SidebarMenuButton asChild className="p-0 h-auto">
                  <NavLink to="/settings" className={getNavClass("/settings")}>
                    <div className="flex items-center min-h-[2.75rem] px-3 py-2 w-full">
                      <Settings className="h-5 w-5 flex-shrink-0 mr-3" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium text-sm leading-tight truncate">Configurações</span>
                        <span className="text-xs text-muted-foreground leading-tight truncate mt-0.5">
                          Preferências do sistema
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
          
          {isCollapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={logout}
                    variant="ghost" 
                    className="w-full justify-center text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 min-h-[2.75rem] px-1"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  <p>Sair</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button 
              onClick={logout}
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 min-h-[2.75rem] px-3"
            >
              <LogOut className="h-5 w-5 flex-shrink-0 mr-3" />
              <span className="font-medium text-sm">Sair</span>
            </Button>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}