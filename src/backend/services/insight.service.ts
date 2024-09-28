import { TransactionService } from './transaction.service';
import { BudgetService } from './budget.service';
import { GoalService } from './goal.service';
import { UserService } from './user.service';
import { IInsight } from '../interfaces/insight.interface';
import { InsightModel } from '../models/insight.model';
import { dateHelpers } from '../utils/dateHelpers.util';
import { currencyFormatter } from '../utils/currencyFormatter.util';
import moment from 'moment';
import _ from 'lodash';

export class InsightService {
  private transactionService: TransactionService;
  private budgetService: BudgetService;
  private goalService: GoalService;
  private userService: UserService;

  constructor(
    transactionService: TransactionService,
    budgetService: BudgetService,
    goalService: GoalService,
    userService: UserService
  ) {
    this.transactionService = transactionService;
    this.budgetService = budgetService;
    this.goalService = goalService;
    this.userService = userService;
  }

  async generateInsights(userId: string): Promise<IInsight[]> {
    // Fetch user's transactions, budgets, and goals
    const transactions = await this.transactionService.getUserTransactions(userId);
    const budgets = await this.budgetService.getUserBudgets(userId);
    const goals = await this.goalService.getUserGoals(userId);

    const insights: IInsight[] = [];

    // Analyze spending patterns
    const spendingPatternInsight = await this.analyzeSpendingPatterns(userId);
    insights.push(spendingPatternInsight);

    // Compare budget performance
    const budgetPerformanceInsight = await this.evaluateBudgetPerformance(userId);
    insights.push(budgetPerformanceInsight);

    // Evaluate goal progress
    const goalProgressInsight = await this.assessGoalProgress(userId);
    insights.push(goalProgressInsight);

    // Generate savings recommendations
    const savingsRecommendation = this.generateSavingsRecommendation(transactions, budgets);
    insights.push(savingsRecommendation);

    // Identify potential investment opportunities
    const investmentOpportunities = this.identifyInvestmentOpportunities(transactions, goals);
    insights.push(investmentOpportunities);

    // Save generated insights
    await Promise.all(insights.map(insight => this.saveInsight(userId, insight)));

    return insights;
  }

  async getInsightsForUser(userId: string): Promise<IInsight[]> {
    return await InsightModel.find({ userId });
  }

  async saveInsight(userId: string, insight: IInsight): Promise<IInsight> {
    const newInsight = new InsightModel({
      userId,
      ...insight
    });
    return await newInsight.save();
  }

  async analyzeSpendingPatterns(userId: string): Promise<IInsight> {
    const threeMonthsAgo = moment().subtract(3, 'months').toDate();
    const transactions = await this.transactionService.getUserTransactions(userId, threeMonthsAgo);

    const categorizedTransactions = _.groupBy(transactions, 'category');
    const categoryTotals = _.mapValues(categorizedTransactions, transactions =>
      _.sumBy(transactions, 'amount')
    );

    const sortedCategories = _.orderBy(
      Object.entries(categoryTotals),
      ([, amount]) => amount,
      'desc'
    );

    const topCategories = sortedCategories.slice(0, 5);

    const insight: IInsight = {
      type: 'spending_pattern',
      title: 'Top Spending Categories',
      description: 'Here are your top 5 spending categories in the last 3 months:',
      data: topCategories.map(([category, amount]) => ({
        category,
        amount: currencyFormatter.format(amount)
      }))
    };

    return insight;
  }

  async evaluateBudgetPerformance(userId: string): Promise<IInsight> {
    const currentDate = new Date();
    const budgets = await this.budgetService.getUserBudgets(userId);
    const transactions = await this.transactionService.getUserTransactions(userId, dateHelpers.getStartOfMonth(currentDate));

    const budgetPerformance = budgets.map(budget => {
      const budgetTransactions = transactions.filter(t => t.category === budget.category);
      const totalSpent = _.sumBy(budgetTransactions, 'amount');
      const remainingBudget = budget.amount - totalSpent;
      const percentageUsed = (totalSpent / budget.amount) * 100;

      return {
        category: budget.category,
        budgeted: budget.amount,
        spent: totalSpent,
        remaining: remainingBudget,
        percentageUsed
      };
    });

    const insight: IInsight = {
      type: 'budget_performance',
      title: 'Budget Performance',
      description: 'Here\'s how you\'re doing with your budgets this month:',
      data: budgetPerformance.map(bp => ({
        category: bp.category,
        status: bp.percentageUsed > 100 ? 'Over budget' : 'Within budget',
        percentageUsed: `${bp.percentageUsed.toFixed(2)}%`,
        remaining: currencyFormatter.format(bp.remaining)
      }))
    };

    return insight;
  }

  async assessGoalProgress(userId: string): Promise<IInsight> {
    const goals = await this.goalService.getUserGoals(userId);

    const goalProgress = goals.map(goal => {
      const totalSaved = goal.currentAmount;
      const remainingAmount = goal.targetAmount - totalSaved;
      const percentageAchieved = (totalSaved / goal.targetAmount) * 100;
      const daysUntilDeadline = moment(goal.targetDate).diff(moment(), 'days');

      return {
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: totalSaved,
        remainingAmount,
        percentageAchieved,
        daysUntilDeadline
      };
    });

    const insight: IInsight = {
      type: 'goal_progress',
      title: 'Financial Goal Progress',
      description: 'Here\'s your progress towards your financial goals:',
      data: goalProgress.map(gp => ({
        name: gp.name,
        progress: `${gp.percentageAchieved.toFixed(2)}%`,
        remaining: currencyFormatter.format(gp.remainingAmount),
        timeLeft: `${gp.daysUntilDeadline} days`
      }))
    };

    return insight;
  }

  private generateSavingsRecommendation(transactions: any[], budgets: any[]): IInsight {
    // Implementation for generating savings recommendations
    // This is a placeholder and should be replaced with actual logic
    return {
      type: 'savings_recommendation',
      title: 'Savings Opportunities',
      description: 'Here are some areas where you might be able to save:',
      data: [
        { category: 'Dining Out', potentialSavings: '$50' },
        { category: 'Entertainment', potentialSavings: '$30' }
      ]
    };
  }

  private identifyInvestmentOpportunities(transactions: any[], goals: any[]): IInsight {
    // Implementation for identifying investment opportunities
    // This is a placeholder and should be replaced with actual logic
    return {
      type: 'investment_opportunities',
      title: 'Investment Opportunities',
      description: 'Consider these investment options based on your financial situation:',
      data: [
        { type: 'Stocks', recommendation: 'Consider investing in index funds' },
        { type: 'Savings', recommendation: 'Look into high-yield savings accounts' }
      ]
    };
  }
}

// Commented list of human tasks
/*
TODO: Implement the following tasks:
1. Implement machine learning models for more accurate spending predictions and investment recommendations
2. Integrate with external financial news APIs to provide market-related insights
3. Implement caching mechanism for frequently accessed insights to improve performance
4. Add more sophisticated algorithms for identifying unusual spending patterns or potential fraud
*/