
export interface CollateralItem {
  id: string;
  name: string;
  type: string;
  value: number;
  description: string;
}

const mockCollateralItems: CollateralItem[] = [
  {
    id: '1',
    name: 'Treasury Bond',
    type: 'Bond',
    value: 10000,
    description: 'US Treasury Bond with 2.5% yield'
  },
  {
    id: '2',
    name: 'Corporate Bond XYZ',
    type: 'Bond',
    value: 5000,
    description: 'Corporate Bond with 3.5% yield'
  },
  {
    id: '3',
    name: 'Apple Stock',
    type: 'Equity',
    value: 15000,
    description: '100 shares of Apple Inc.'
  },
  {
    id: '4',
    name: 'Google Stock',
    type: 'Equity',
    value: 20000,
    description: '50 shares of Alphabet Inc.'
  },
  {
    id: '5',
    name: 'Real Estate Property',
    type: 'Real Estate',
    value: 500000,
    description: 'Commercial property in downtown'
  },
  {
    id: '6',
    name: 'Gold',
    type: 'Commodity',
    value: 8000,
    description: '5 ounces of gold'
  },
  {
    id: '7',
    name: 'Silver',
    type: 'Commodity',
    value: 3000,
    description: '100 ounces of silver'
  },
  {
    id: '8',
    name: 'Bitcoin',
    type: 'Cryptocurrency',
    value: 25000,
    description: '0.5 BTC'
  },
  {
    id: '9',
    name: 'Ethereum',
    type: 'Cryptocurrency',
    value: 12000,
    description: '5 ETH'
  },
  {
    id: '10',
    name: 'Municipal Bond',
    type: 'Bond',
    value: 7500,
    description: 'Municipal Bond with tax advantages'
  }
];

/**
 * Searches for collateral items by name
 * @param searchTerm The search term to look for in collateral names
 * @returns Promise with matching collateral items
 */
export const searchCollateralItems = async (searchTerm: string): Promise<CollateralItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!searchTerm.trim()) {
    return [];
  }
  
  const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
  return mockCollateralItems.filter(item => 
    item.name.toLowerCase().includes(normalizedSearchTerm)
  );
};

/**
 * Fetches a collateral item by ID
 * @param id The ID of the collateral item to fetch
 * @returns Promise with the collateral item or null if not found
 */
export const getCollateralItemById = async (id: string): Promise<CollateralItem | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const item = mockCollateralItems.find(item => item.id === id);
  return item || null;
};

/**
 * Fetches all collateral items
 * @returns Promise with all collateral items
 */
export const getAllCollateralItems = async (): Promise<CollateralItem[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [...mockCollateralItems];
};
