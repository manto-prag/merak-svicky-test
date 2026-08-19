export type Language = 'cs' | 'en';

export interface Scent {
  id: string;
  nameCs: string;
  nameEn: string;
  family: 'floral' | 'woody' | 'citrus' | 'gourmand' | 'fresh';
  topNotesCs: string;
  topNotesEn: string;
  middleNotesCs: string;
  middleNotesEn: string;
  baseNotesCs: string;
  baseNotesEn: string;
  moodCs: string;
  moodEn: string;
  intensity: number; // 1-5
  descriptionCs: string;
  descriptionEn: string;
  colorHint: string;
  iconName: string;
  inStock: boolean;
  stockCount: number;
}

export interface CandleColor {
  id: string;
  nameCs: string;
  nameEn: string;
  hex: string;
  secondaryHex?: string;
  moodCs: string;
  moodEn: string;
  descriptionCs: string;
  descriptionEn: string;
  inStock: boolean;
  stockCount: number;
}

export interface Packaging {
  id: string;
  nameCs: string;
  nameEn: string;
  materialCs: string;
  materialEn: string;
  lidCs: string;
  lidEn: string;
  volume: string; // e.g. 220 ml
  burnTime: string; // e.g. 45-50 hodin
  priceModifier: number; // in CZK
  descriptionCs: string;
  descriptionEn: string;
  vesselStyle: 'amber-jar' | 'matte-ceramic' | 'ribbed-glass' | 'concrete-pot' | 'matte-black' | 'rose-gold-tin' | 'apothecary-clear' | 'speckled-clay' | 'vintage-green' | 'hexagon-wood';
  inStock: boolean;
  stockCount: number;
}

export type WickType = 'cotton' | 'wood';
export type LabelStyle = 'minimal' | 'botanical' | 'modern' | 'gold-script' | 'none';

export interface CustomCandle {
  packagingId: string;
  scentId: string;
  colorId: string;
  wickType: WickType;
  labelStyle: LabelStyle;
  customMessage: string;
  recipientName?: string;
  quantity: number;
  unitPriceCzk: number;
}

export interface CartItem {
  id: string;
  candle: CustomCandle;
  packaging: Packaging;
  scent: Scent;
  color: CandleColor;
  totalPriceCzk: number;
}

export interface GiftSet {
  id: string;
  nameCs: string;
  nameEn: string;
  priceCzk: number;
  descriptionCs: string;
  descriptionEn: string;
  itemsCs: string[];
  itemsEn: string[];
  tagCs: string;
  tagEn: string;
  imageBg: string;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'in_production' | 'shipped' | 'delivered';

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  type: 'zbox' | 'partner' | 'branch';
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  street?: string;
  city?: string;
  zip?: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. MRK-2026-8492
  createdAt: string;
  status: OrderStatus;
  customer: OrderCustomer;
  deliveryMethod: 'packeta_point' | 'packeta_home';
  pickupPoint?: PickupPoint;
  paymentMethod: 'qr_transfer' | 'card' | 'cod';
  items: CartItem[];
  subtotalCzk: number;
  shippingCzk: number;
  totalCzk: number;
  trackingNumber?: string;
  carrier?: string;
  paidAt?: string;
  shippedAt?: string;
  emailLogs: EmailLog[];
}

export interface EmailLog {
  id: string;
  type: 'order_confirmation' | 'payment_received' | 'shipping_confirmation';
  recipient: string;
  subject: string;
  sentAt: string;
  contentHtml: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  textCs: string;
  textEn: string;
  candleComboCs: string;
  candleComboEn: string;
  date: string;
}

export type NavView = 'home' | 'configurator' | 'scents' | 'colors' | 'packaging' | 'gifts' | 'about' | 'contact' | 'admin';
