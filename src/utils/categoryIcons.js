import React from 'react';
import {
  Baby,
  Car,
  Clapperboard,
  CircleDollarSign,
  Coins,
  FileText,
  Home,
  ReceiptText,
  Utensils,
  UserRound,
  Wallet
} from 'lucide-react';

export const categoryIconMap = {
  Bills: ReceiptText,
  Baby,
  House: Home,
  Entertainment: Clapperboard,
  Food: Utensils,
  Transport: Car,
  Slava: UserRound,
  Salary: CircleDollarSign,
  Other: Wallet,
  Utilities: ReceiptText,
  'Food & Dining': Utensils,
  Transportation: Car
};

export const defaultCategoryIconMap = {
  bills: ReceiptText,
  baby: Baby,
  house: Home,
  entertainment: Clapperboard,
  food: Utensils,
  transport: Car,
  slava: UserRound,
  salary: CircleDollarSign,
  'other-income': Wallet
};

export function getCategoryIcon(category, fallbackId) {
  return categoryIconMap[category] || defaultCategoryIconMap[fallbackId] || FileText;
}

export function renderCategoryIcon(category, fallbackId, props = {}) {
  const Icon = getCategoryIcon(category, fallbackId);

  return <Icon aria-hidden="true" focusable="false" {...props} />;
}

export const incomeTypeIcon = Coins;
export const expenseTypeIcon = Wallet;
