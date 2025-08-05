import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos de dados
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  accountId?: string;
  creditCardId?: string;
  installments?: {
    current: number;
    total: number;
    installmentValue: number;
  };
  tags?: string[];
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'business' | 'digital';
  bank: string;
  balance: number;
  accountNumber: string;
  isActive: boolean;
  lastTransaction: string;
  monthlyChange: number;
  openDate?: string;
  agency?: string;
  manager?: string;
  creditLimit?: number;
  monthlyFee?: number;
}

export interface CreditCard {
  id: string;
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
  minimumPayment: number;
  invoiceStatus: 'pending' | 'paid' | 'overdue';
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  dueDate?: string;
  broker: string;
}

export interface Budget {
  id: string;
  name: string;
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  period: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  revenue: number;
  expenses: number;
  profit: number;
  employees: number;
  segment: string;
}

interface DataContextType {
  transactions: Transaction[];
  accounts: Account[];
  creditCards: CreditCard[];
  investments: Investment[];
  budgets: Budget[];
  goals: Goal[];
  companies: Company[];
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  addCreditCard: (creditCard: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (id: string, creditCard: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;
  payCreditCardInvoice: (id: string, amount: number) => void;
  
  getTotalBalance: () => number;
  getTotalCreditCardDebt: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getNetWorth: () => number;
  getCreditCardTransactions: (creditCardId: string) => Transaction[];
  getAccountTransactions: (accountId: string) => Transaction[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Dados mockados iniciais profissionais
const initialTransactions: Transaction[] = [
  // Transações de conta corrente
  {
    id: 't1',
    date: '2024-08-05',
    description: 'Salário Agosto',
    amount: 15000.00,
    type: 'credit',
    category: 'Salário',
    accountId: 'acc1',
    status: 'completed'
  },
  {
    id: 't2',
    date: '2024-08-04',
    description: 'Transferência PIX recebida',
    amount: 2500.00,
    type: 'credit',
    category: 'Transferência',
    accountId: 'acc1',
    status: 'completed'
  },
  {
    id: 't3',
    date: '2024-08-04',
    description: 'Conta de luz',
    amount: -385.50,
    type: 'debit',
    category: 'Utilidades',
    accountId: 'acc1',
    status: 'completed'
  },
  // Transações de cartão de crédito
  {
    id: 't4',
    date: '2024-08-03',
    description: 'Compra Veículo - Concessionária ABC',
    amount: -45000.00,
    type: 'debit',
    category: 'Veículo',
    creditCardId: 'cc1',
    installments: {
      current: 1,
      total: 48,
      installmentValue: 937.50
    },
    status: 'completed'
  },
  {
    id: 't5',
    date: '2024-08-02',
    description: 'Notebook Dell Inspiron',
    amount: -3200.00,
    type: 'debit',
    category: 'Equipamentos',
    creditCardId: 'cc1',
    installments: {
      current: 1,
      total: 12,
      installmentValue: 266.67
    },
    status: 'completed'
  },
  {
    id: 't6',
    date: '2024-08-02',
    description: 'Supermercado Extra',
    amount: -450.80,
    type: 'debit',
    category: 'Alimentação',
    creditCardId: 'cc1',
    status: 'completed'
  },
  {
    id: 't7',
    date: '2024-08-01',
    description: 'Posto Shell',
    amount: -280.00,
    type: 'debit',
    category: 'Combustível',
    creditCardId: 'cc2',
    status: 'completed'
  },
  {
    id: 't8',
    date: '2024-07-30',
    description: 'Microsoft Office 365',
    amount: -890.00,
    type: 'debit',
    category: 'Software',
    creditCardId: 'cc2',
    installments: {
      current: 2,
      total: 6,
      installmentValue: 148.33
    },
    status: 'completed'
  }
];

const initialAccounts: Account[] = [
  {
    id: 'acc1',
    name: 'Conta Corrente Empresarial',
    type: 'business',
    bank: 'Banco do Brasil',
    balance: 45280.50,
    accountNumber: '12345-6',
    isActive: true,
    lastTransaction: '2024-08-05',
    monthlyChange: 12.5,
    openDate: '2020-01-15',
    agency: '0001',
    manager: 'Maria Santos'
  },
  {
    id: 'acc2',
    name: 'Poupança Reserva',
    type: 'savings',
    bank: 'Caixa Econômica',
    balance: 25000.00,
    accountNumber: '98765-4',
    isActive: true,
    lastTransaction: '2024-08-01',
    monthlyChange: 0.8
  },
  {
    id: 'acc3',
    name: 'Conta Digital',
    type: 'digital',
    bank: 'Nubank',
    balance: 3500.00,
    accountNumber: '11111-1',
    isActive: true,
    lastTransaction: '2024-08-04',
    monthlyChange: 5.2
  }
];

const initialCreditCards: CreditCard[] = [
  {
    id: 'cc1',
    name: 'Cartão Empresarial Principal',
    bank: 'Banco do Brasil',
    brand: 'visa',
    lastDigits: '1234',
    totalLimit: 50000,
    usedLimit: 15687.30,
    availableLimit: 34312.70,
    closingDay: 15,
    dueDay: 10,
    annualFee: 120,
    isActive: true,
    currentInvoice: 15687.30,
    nextDueDate: '2024-08-10',
    minimumPayment: 783.37,
    invoiceStatus: 'pending'
  },
  {
    id: 'cc2',
    name: 'Cartão Compras Operacionais',
    bank: 'Nubank',
    brand: 'mastercard',
    lastDigits: '5678',
    totalLimit: 25000,
    usedLimit: 1318.33,
    availableLimit: 23681.67,
    closingDay: 20,
    dueDay: 15,
    annualFee: 0,
    isActive: true,
    currentInvoice: 1318.33,
    nextDueDate: '2024-08-15',
    minimumPayment: 65.92,
    invoiceStatus: 'pending'
  }
];

const initialInvestments: Investment[] = [
  {
    id: 'inv1',
    name: 'CDB Banco do Brasil',
    type: 'CDB',
    amount: 50000.00,
    currentValue: 52800.00,
    profitLoss: 2800.00,
    profitLossPercentage: 5.6,
    dueDate: '2025-08-01',
    broker: 'Banco do Brasil'
  },
  {
    id: 'inv2',
    name: 'Tesouro Selic 2029',
    type: 'Tesouro Direto',
    amount: 30000.00,
    currentValue: 31950.00,
    profitLoss: 1950.00,
    profitLossPercentage: 6.5,
    dueDate: '2029-08-01',
    broker: 'Rico Investimentos'
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [creditCards, setCreditCards] = useState<CreditCard[]>(initialCreditCards);
  const [investments] = useState<Investment[]>(initialInvestments);
  const [budgets] = useState<Budget[]>([]);
  const [goals] = useState<Goal[]>([]);
  const [companies] = useState<Company[]>([]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `t${Date.now()}`
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    if (transaction.accountId) {
      setAccounts(prev => prev.map(acc => 
        acc.id === transaction.accountId 
          ? { ...acc, balance: acc.balance + transaction.amount }
          : acc
      ));
    }
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, ...updatedTransaction } : t
    ));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...account,
      id: `acc${Date.now()}`
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (id: string, updatedAccount: Partial<Account>) => {
    setAccounts(prev => prev.map(acc => 
      acc.id === id ? { ...acc, ...updatedAccount } : acc
    ));
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const addCreditCard = (creditCard: Omit<CreditCard, 'id'>) => {
    const newCreditCard: CreditCard = {
      ...creditCard,
      id: `cc${Date.now()}`
    };
    setCreditCards(prev => [...prev, newCreditCard]);
  };

  const updateCreditCard = (id: string, updatedCreditCard: Partial<CreditCard>) => {
    setCreditCards(prev => prev.map(cc => 
      cc.id === id ? { ...cc, ...updatedCreditCard } : cc
    ));
  };

  const deleteCreditCard = (id: string) => {
    setCreditCards(prev => prev.filter(cc => cc.id !== id));
  };

  const payCreditCardInvoice = (creditCardId: string, paymentAmount: number) => {
    setCreditCards(prev => prev.map(cc => 
      cc.id === creditCardId 
        ? { 
            ...cc, 
            currentInvoice: Math.max(0, cc.currentInvoice - paymentAmount),
            usedLimit: Math.max(0, cc.usedLimit - paymentAmount),
            availableLimit: cc.totalLimit - Math.max(0, cc.usedLimit - paymentAmount),
            invoiceStatus: paymentAmount >= cc.currentInvoice ? 'paid' : 'pending'
          } 
        : cc
    ));

    const paymentTransaction: Transaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Pagamento Fatura - ${creditCards.find(cc => cc.id === creditCardId)?.name}`,
      amount: -paymentAmount,
      type: 'debit',
      category: 'Pagamento Cartão',
      accountId: 'acc1',
      status: 'completed'
    };

    addTransaction(paymentTransaction);
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  const getTotalCreditCardDebt = () => {
    return creditCards.reduce((total, card) => total + card.currentInvoice, 0);
  };

  const getMonthlyIncome = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.type === 'credit'
        );
      })
      .reduce((total, t) => total + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return Math.abs(transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear &&
          t.type === 'debit'
        );
      })
      .reduce((total, t) => total + t.amount, 0));
  };

  const getNetWorth = () => {
    const totalInvestments = investments.reduce((total, inv) => total + inv.currentValue, 0);
    return getTotalBalance() + totalInvestments - getTotalCreditCardDebt();
  };

  const getCreditCardTransactions = (creditCardId: string) => {
    return transactions.filter(t => t.creditCardId === creditCardId);
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId);
  };

  const value: DataContextType = {
    transactions,
    accounts,
    creditCards,
    investments,
    budgets,
    goals,
    companies,
    
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    payCreditCardInvoice,
    
    getTotalBalance,
    getTotalCreditCardDebt,
    getMonthlyIncome,
    getMonthlyExpenses,
    getNetWorth,
    getCreditCardTransactions,
    getAccountTransactions,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};