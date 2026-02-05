/**
 * Order Export Types
 *
 * These types match the backend PublicOrderExportDto structure.
 * Used for displaying digital receipts to customers.
 */

export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";
export type PaymentStatus =
  | "PENDING"
  | "PARTIAL"
  | "PAID"
  | "CANCELLED"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED";
export type FulfillmentMethod = "IN_STORE" | "PICKUP" | "DELIVERY" | "DINE_IN";
export type FulfillmentStatus =
  | "PENDING"
  | "PREPARING"
  | "READY"
  | "DELIVERING"
  | "COMPLETED"
  | "CANCELLED";
export type RefundStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";

/**
 * Store information visible on receipts
 */
export interface OrderExportStore {
  name: string;
  currency: string;
  contactPhone?: string;
  contactEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  receiptLogoUrl?: string;
  headerText?: string;
  footerText?: string;
  showStoreAddress: boolean;
  showStorePhone: boolean;
  showLogo: boolean;
  showHeader: boolean;
}

/**
 * Order item visible on receipts
 */
export interface OrderExportItem {
  productName: string;
  variantName?: string;
  productSku?: string;
  variantAttributes?: Record<string, string>;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
  lineDiscount: number;
  lineTax: number;
  lineTotal: number;
}

/**
 * Delivery address visible on receipts
 */
export interface OrderExportDeliveryAddress {
  contactPhone?: string;
  region?: string;
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  zip?: string;
  additionalDetails?: string;
  cityName?: string;
  countryName?: string;
}

/**
 * Refund information visible on receipts
 */
export interface OrderExportRefund {
  refundedAmount: number;
  status: RefundStatus;
  reason?: string;
  processedAt?: string;
  createdAt: string;
}

/**
 * Main order export DTO - matches backend PublicOrderExportDto
 */
export interface OrderExportData {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: OrderStatus;
  fulfillmentMethod: FulfillmentMethod;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  serviceFees: number;
  deliveryFees: number;
  totalAmount: number;
  amountRefunded: number;
  store: OrderExportStore;
  items: OrderExportItem[];
  deliveryAddress?: OrderExportDeliveryAddress;
  refunds?: OrderExportRefund[];
  completedAt?: string;
}
