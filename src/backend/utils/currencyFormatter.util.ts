/**
 * This utility file provides functions for formatting currency values in the Mint Replica application.
 * It ensures consistent currency representation across the backend services.
 */

/**
 * Formats a number as a currency string based on the specified locale and currency code.
 * @param amount The numeric amount to format
 * @param locale The locale to use for formatting (e.g., 'en-US', 'fr-FR')
 * @param currencyCode The ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, locale: string, currencyCode: string): string {
  // Check if the amount is a valid number
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new Error('Invalid amount provided for currency formatting');
  }

  // Use Intl.NumberFormat to format the amount based on the provided locale and currency code
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  });

  // Return the formatted currency string
  return formatter.format(amount);
}

/**
 * Parses a currency string and returns the numeric value.
 * @param currencyString The currency string to parse
 * @param locale The locale to use for parsing (e.g., 'en-US', 'fr-FR')
 * @returns Parsed numeric value of the currency string
 */
export function parseCurrency(currencyString: string, locale: string): number {
  // Remove currency symbols and thousands separators from the input string
  const cleanedString = currencyString.replace(/[^\d.,]/g, '');

  // Parse the cleaned string to a float value
  const parsedValue = parseFloat(cleanedString.replace(',', '.'));

  // Check if the parsed value is a valid number
  if (isNaN(parsedValue)) {
    throw new Error('Invalid currency string provided for parsing');
  }

  // Return the parsed numeric value
  return parsedValue;
}

/**
 * Converts an amount from one currency to another using the latest exchange rates.
 * @param amount The amount to convert
 * @param fromCurrency The currency code to convert from
 * @param toCurrency The currency code to convert to
 * @returns Converted amount in the target currency
 */
export async function convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<number> {
  // TODO: Implement fetching the latest exchange rates from an external API or database
  // For now, we'll use a placeholder exchange rate
  const exchangeRate = 1.2; // This should be replaced with actual API call

  // Calculate the converted amount using the exchange rate
  const convertedAmount = amount * exchangeRate;

  // Return the converted amount
  return Number(convertedAmount.toFixed(2));
}

// TODO: Implement error handling for invalid inputs in all functions
// TODO: Integrate with a reliable exchange rate API or service for the convertCurrency function
// TODO: Add unit tests for all currency formatting and conversion functions
// TODO: Ensure that the currency conversion logic handles edge cases like outdated exchange rates