// Currency formatting utility
export const formatCurrency = (amount, currency = 'ALL', locale = 'sq-AL') => {
  if (amount === null || amount === undefined) return '-'

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    console.warn('Currency formatting failed:', error)
    return `${amount} ${currency}`
  }
}

// Format number as currency without currency symbol
export const formatNumber = (amount, locale = 'sq-AL') => {
  if (amount === null || amount === undefined) return '-'

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    console.warn('Number formatting failed:', error)
    return amount.toString()
  }
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '-'

  try {
    return `${value.toFixed(decimals)}%`
  } catch (error) {
    console.warn('Percentage formatting failed:', error)
    return `${value}%`
  }
}