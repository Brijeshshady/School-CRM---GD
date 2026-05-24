const Expense = require('../models/Expense');
const Fee = require('../models/Fee');
const asyncHandler = require('../middleware/asyncHandler');
const { HTTP_STATUS } = require('../constants');

// @desc    Get all income/expense records
// @route   GET /api/finance/expenses
// @access  Private (Admin)
exports.getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({}).sort('-date');
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: expenses,
  });
});

// @desc    Create a new income or expense log
// @route   POST /api/finance/expenses
// @access  Private (Admin)
exports.createExpense = asyncHandler(async (req, res) => {
  const { title, category, amount, type, date, notes } = req.body;

  if (!title || !category || !amount || !type) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Please provide title, category, amount, and transaction type (Income/Expense)',
    });
  }

  const transaction = await Expense.create({
    title,
    category,
    amount,
    type,
    date: date || new Date(),
    notes,
  });

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    data: transaction,
  });
});

// @desc    Get compiled financial reports (Trial Balance, P&L, Balance Sheet stubs)
// @route   GET /api/finance/statement
// @access  Private (Admin)
exports.getFinancialStatement = asyncHandler(async (req, res) => {
  // 1. Fetch expenses
  const expenses = await Expense.find({});
  
  // 2. Fetch fee receipts (as primary Income)
  const feeInvoices = await Fee.find({ status: 'Paid' });
  const feeIncomeTotal = feeInvoices.reduce((sum, f) => sum + (f.amountPaid || f.amount || 0), 0);

  // Group expenses and other incomes
  let salaries = 0;
  let utilities = 0;
  let maintenance = 0;
  let assets = 0;
  let library = 0;
  let otherExpenses = 0;
  let otherIncomes = 0;

  expenses.forEach(item => {
    if (item.type === 'Expense') {
      if (item.category === 'Salary') salaries += item.amount;
      else if (item.category === 'Utilities') utilities += item.amount;
      else if (item.category === 'Maintenance') maintenance += item.amount;
      else if (item.category === 'Assets') assets += item.amount;
      else if (item.category === 'Library') library += item.amount;
      else otherExpenses += item.amount;
    } else {
      otherIncomes += item.amount;
    }
  });

  const totalIncome = feeIncomeTotal + otherIncomes;
  const totalExpense = salaries + utilities + maintenance + library + otherExpenses; // Assets are capitalized

  // Profit and Loss calculations
  const netProfit = totalIncome - totalExpense;

  // Compile Trial Balance
  const trialBalance = {
    debit: {
      salaries,
      utilities,
      maintenance,
      library,
      otherExpenses,
      capitalAssets: assets,
      cashAndBank: Math.max(0, netProfit + 1500000), // simulated starting cash reserve + net
    },
    credit: {
      feesRevenue: feeIncomeTotal,
      otherIncomes,
      capitalFund: 1500000, // starting fund
    }
  };

  // Compile Balance Sheet
  const balanceSheet = {
    assets: {
      fixedAssets: assets + 800000, // starting assets + new
      currentAssets: {
        cashAndBank: Math.max(0, netProfit + 1500000),
        receivables: (await Fee.find({ status: 'Pending' })).reduce((sum, f) => sum + (f.amount - (f.amountPaid || 0)), 0)
      }
    },
    liabilities: {
      capitalFund: 1500000,
      retainedEarnings: netProfit,
      currentLiabilities: 0
    }
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      summary: {
        totalIncome,
        totalExpense,
        netProfit,
      },
      trialBalance,
      balanceSheet,
      breakdown: {
        salaries,
        utilities,
        maintenance,
        library,
        assets,
        otherExpenses,
        feesRevenue: feeIncomeTotal,
        otherIncomes
      }
    }
  });
});
