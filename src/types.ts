export type MainCategory = 'gaming' | 'social' | 'website';
export type SubCategory = 'gaming-topup' | 'gaming-accounts' | 'social-services' | 'social-accounts' | 'web-development';
export type ProductCategory = MainCategory;

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Completed' | 'Cancelled';

export interface ProductPackage {
  id: string;
  name: string;
  amount: number; // e.g. 660 or 1000
  unit: string;   // e.g. "UC", "Coins", "Diamonds", "Stars", "CP", "Months", "Followers", "Account"
  price: number;  // Price in ETB / BIRR
  currency?: string; // "BIRR"
  quantity?: number; // Alias for amount/count
  packageType?: string; // e.g. "By ID", "Login Price", "Verified Account"
  packageGroup?: string; // e.g. "Diamonds", "Membership & Pass", "Monetized", "Aged"
  packageNote?: string; // e.g. "UC የሚገባበት ጊዜ 2-8 ደቂቃ!" or "Login price 3-7 ደቂቃ ይገባል"
  description?: string;
  originalPrice?: number;
  badge?: string; // e.g. "Popular", "Best Value", "Hot", "Verified"
  isInstant?: boolean;
}

export interface RequiredField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'email' | 'select';
  options?: string[];
  helperText?: string;
  required: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: MainCategory;
  subCategory: SubCategory;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  image: string;
  packageType?: string; // e.g. "By ID", "Login", "Android", "iPhone", "Verified Account"
  badge?: string;
  isPopular?: boolean;
  popularPriceText?: string; // Custom highlight text for popular cards, e.g. "2130 Coins ➡️ 3,900 Birr"
  status: 'In Stock' | 'Fast Delivery' | 'Limited Stock' | 'Maintenance';
  requiredFields: RequiredField[];
  packages: ProductPackage[];
  packageNote?: string;
  deliveryEstimate: string;
  guideSteps?: string[];
  referenceUrl?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  accountNumber: string;
  accountName: string;
  feePercent?: number;
  badge?: string;
  instructions?: string;
}

export interface OrderItem {
  orderId: string; // Format: BABI-XXXXX
  productId: string;
  productName: string;
  productCategory: ProductCategory;
  productSubCategory?: SubCategory;
  productImage: string;
  packageId: string;
  packageName: string;
  packageUnit: string;
  quantity: number;
  amount: number;
  totalPrice: number;
  paymentMethod: string;
  paymentAccount?: string;
  transactionId?: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Under Review';
  orderStatus: OrderStatus;
  customerInfo: Record<string, string>;
  telegramUser: {
    id: number;
    username: string;
    firstName: string;
    lastName?: string;
  };
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface TelegramUser {
  id: number;
  username: string;
  first_name: string;
  last_name?: string;
  photo_url?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface StoreSubCategory {
  id: SubCategory;
  mainCategoryId: MainCategory;
  name: string;
  emoji: string;
  icon: string;
  description: string;
  productCount?: number;
}

export interface StoreCategory {
  id: MainCategory;
  name: string;
  icon: string;
  emoji: string;
  description: string;
  accentColor: string;
  subcategories: StoreSubCategory[];
  productCount?: number;
}
