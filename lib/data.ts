import { Product } from '@/store/useCartStore';

export const categories = [
  { id: 'fruits', name: 'Fruits', image: '🍎', color: 'bg-red-50 text-red-600' },
  { id: 'vegetables', name: 'Vegetables', image: '🥦', color: 'bg-green-50 text-green-600' },
  { id: 'milk', name: 'Milk & Dairy', image: '🥛', color: 'bg-blue-50 text-blue-600' },
  { id: 'bread', name: 'Bakery', image: '🍞', color: 'bg-amber-50 text-amber-600' },
  { id: 'eggs', name: 'Eggs & Meat', image: '🥚', color: 'bg-orange-50 text-orange-600' },
  { id: 'rice', name: 'Rice & Grains', image: '🍚', color: 'bg-stone-50 text-stone-600' },
  { id: 'snacks', name: 'Snacks', image: '🍟', color: 'bg-yellow-50 text-yellow-600' },
  { id: 'cold-drinks', name: 'Beverages', image: '🥤', color: 'bg-cyan-50 text-cyan-600' },
];

export const mockProducts: Product[] = [
  { id: 'p1', name: 'Farm Fresh Apples', description: 'Crisp and sweet apples straight from the orchard.', price: 120, mrp: 150, weight: '1 kg', category: 'fruits', image: 'https://picsum.photos/seed/apple/400/400', inStock: true, rating: 4.8 },
  { id: 'p2', name: 'Organic Bananas', description: 'Naturally ripened, premium quality bananas.', price: 60, mrp: 80, weight: '1 dozen', category: 'fruits', image: 'https://picsum.photos/seed/banana/400/400', inStock: true, rating: 4.5 },
  { id: 'p3', name: 'Fresh Potatoes', description: 'Versatile and essential for every kitchen.', price: 40, mrp: 50, weight: '1 kg', category: 'vegetables', image: 'https://picsum.photos/seed/potato/400/400', inStock: true, rating: 4.7 },
  { id: 'p4', name: 'Onions', description: 'Fresh, pungent onions.', price: 35, mrp: 45, weight: '1 kg', category: 'vegetables', image: 'https://picsum.photos/seed/onion/400/400', inStock: true, rating: 4.6 },
  { id: 'p5', name: 'Amul Taaza Toned Milk', description: 'Fresh toned milk, homogenized.', price: 54, mrp: 54, weight: '1 L', category: 'milk', image: 'https://picsum.photos/seed/milk/400/400', inStock: true, rating: 4.9 },
  { id: 'p6', name: 'Britannia Whole Wheat Bread', description: 'Soft and healthy whole wheat bread.', price: 50, mrp: 55, weight: '400 g', category: 'bread', image: 'https://picsum.photos/seed/bread/400/400', inStock: true, rating: 4.3 },
  { id: 'p7', name: 'Farm Fresh Brown Eggs', description: 'Rich in protein, farm fresh brown eggs.', price: 85, mrp: 100, weight: '6 pcs', category: 'eggs', image: 'https://picsum.photos/seed/eggs/400/400', inStock: true, rating: 4.8 },
  { id: 'p8', name: 'India Gate Basmati Rice', description: 'Premium quality basmati rice for perfect biryani.', price: 220, mrp: 260, weight: '1 kg', category: 'rice', image: 'https://picsum.photos/seed/rice/400/400', inStock: true, rating: 4.7 },
  { id: 'p9', name: 'Aashirvaad Shudh Chakki Atta', description: '100% pure whole wheat atta.', price: 230, mrp: 250, weight: '5 kg', category: 'rice', image: 'https://picsum.photos/seed/atta/400/400', inStock: true, rating: 4.9 },
  { id: 'p10', name: 'Fortune Sunlite Sunflower Oil', description: 'Light and healthy cooking oil.', price: 145, mrp: 170, weight: '1 L', category: 'vegetables', image: 'https://picsum.photos/seed/oil/400/400', inStock: true, rating: 4.6 },
  { id: 'p11', name: 'Lay\'s India\'s Magic Masala', description: 'Spicy and crunchy potato chips.', price: 20, mrp: 20, weight: '50 g', category: 'snacks', image: 'https://picsum.photos/seed/chips/400/400', inStock: true, rating: 4.5 },
  { id: 'p12', name: 'Coca Cola', description: 'Refreshing cola drink.', price: 40, mrp: 40, weight: '750 ml', category: 'cold-drinks', image: 'https://picsum.photos/seed/cola/400/400', inStock: true, rating: 4.4 },
];

export const getProducts = () => mockProducts;
export const getProductById = (id: string) => mockProducts.find(p => p.id === id);
export const getProductsByCategory = (categoryId: string) => mockProducts.filter(p => p.category === categoryId);
