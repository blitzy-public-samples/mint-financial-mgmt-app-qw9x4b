import mongoose, { Model } from 'mongoose';
import { InvestmentPortfolio, IInvestmentPortfolio } from '../../models/mongodb/investmentPortfolio.model';

export class InvestmentPortfolioRepository {
  private model: Model<IInvestmentPortfolio>;

  constructor() {
    this.model = InvestmentPortfolio;
  }

  /**
   * Create a new investment portfolio
   * @param portfolioData The data for the new investment portfolio
   * @returns The created investment portfolio
   */
  async create(portfolioData: IInvestmentPortfolio): Promise<IInvestmentPortfolio> {
    const newPortfolio = new this.model(portfolioData);
    return await newPortfolio.save();
  }

  /**
   * Find an investment portfolio by its ID
   * @param id The ID of the investment portfolio
   * @returns The found investment portfolio or null if not found
   */
  async findById(id: string): Promise<IInvestmentPortfolio | null> {
    return await this.model.findById(id);
  }

  /**
   * Find all investment portfolios for a user
   * @param userId The ID of the user
   * @returns An array of investment portfolios
   */
  async findByUserId(userId: string): Promise<IInvestmentPortfolio[]> {
    return await this.model.find({ userId });
  }

  /**
   * Update an investment portfolio
   * @param id The ID of the investment portfolio to update
   * @param updateData The data to update in the investment portfolio
   * @returns The updated investment portfolio or null if not found
   */
  async update(id: string, updateData: Partial<IInvestmentPortfolio>): Promise<IInvestmentPortfolio | null> {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }

  /**
   * Delete an investment portfolio
   * @param id The ID of the investment portfolio to delete
   * @returns True if deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Add a new holding to an investment portfolio
   * @param portfolioId The ID of the investment portfolio
   * @param holding The new holding to add
   * @returns The updated investment portfolio or null if not found
   */
  async addHolding(portfolioId: string, holding: IHolding): Promise<IInvestmentPortfolio | null> {
    const portfolio = await this.model.findById(portfolioId);
    if (!portfolio) return null;

    portfolio.holdings.push(holding);
    portfolio.totalValue = this.calculateTotalValue(portfolio.holdings);
    return await portfolio.save();
  }

  /**
   * Update an existing holding in an investment portfolio
   * @param portfolioId The ID of the investment portfolio
   * @param holdingId The ID of the holding to update
   * @param updateData The data to update in the holding
   * @returns The updated investment portfolio or null if not found
   */
  async updateHolding(portfolioId: string, holdingId: string, updateData: Partial<IHolding>): Promise<IInvestmentPortfolio | null> {
    const portfolio = await this.model.findById(portfolioId);
    if (!portfolio) return null;

    const holdingIndex = portfolio.holdings.findIndex(h => h._id.toString() === holdingId);
    if (holdingIndex === -1) return null;

    portfolio.holdings[holdingIndex] = { ...portfolio.holdings[holdingIndex], ...updateData };
    portfolio.totalValue = this.calculateTotalValue(portfolio.holdings);
    return await portfolio.save();
  }

  /**
   * Remove a holding from an investment portfolio
   * @param portfolioId The ID of the investment portfolio
   * @param holdingId The ID of the holding to remove
   * @returns The updated investment portfolio or null if not found
   */
  async removeHolding(portfolioId: string, holdingId: string): Promise<IInvestmentPortfolio | null> {
    const portfolio = await this.model.findById(portfolioId);
    if (!portfolio) return null;

    portfolio.holdings = portfolio.holdings.filter(h => h._id.toString() !== holdingId);
    portfolio.totalValue = this.calculateTotalValue(portfolio.holdings);
    return await portfolio.save();
  }

  /**
   * Update the performance data of an investment portfolio
   * @param portfolioId The ID of the investment portfolio
   * @param performanceData The new performance data
   * @returns The updated investment portfolio or null if not found
   */
  async updatePerformance(portfolioId: string, performanceData: IPerformance): Promise<IInvestmentPortfolio | null> {
    return await this.model.findByIdAndUpdate(
      portfolioId,
      { $set: { performance: performanceData } },
      { new: true }
    );
  }

  /**
   * Calculate the total value of all holdings in a portfolio
   * @param holdings An array of holdings
   * @returns The total value of all holdings
   */
  private calculateTotalValue(holdings: IHolding[]): number {
    return holdings.reduce((total, holding) => total + holding.currentValue, 0);
  }
}

export default InvestmentPortfolioRepository;

// TODO: Implement error handling for database operations
// TODO: Add input validation for all methods to ensure data integrity
// TODO: Implement pagination for methods that return multiple portfolios
// TODO: Add method to calculate and update portfolio performance periodically
// TODO: Implement caching mechanism for frequently accessed portfolios