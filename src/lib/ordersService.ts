import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { OrderItem, OrderStatus, Product, ProductPackage } from '../types';

export const ORDERS_COLLECTION = 'orders';
const LOCAL_STORAGE_ORDER_IDS_KEY = 'babi_store_customer_order_ids';

/**
 * Local Storage helpers for tracking placed customer order IDs across visits
 */
export function getLocalOrderIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ORDER_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not read local order IDs:', e);
    return [];
  }
}

export function saveLocalOrderId(orderId: string): void {
  try {
    const existing = getLocalOrderIds();
    if (!existing.includes(orderId)) {
      const updated = [orderId, ...existing];
      localStorage.setItem(LOCAL_STORAGE_ORDER_IDS_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Could not save local order ID:', e);
  }
}

/**
 * Normalize raw status string from Firestore into standard client OrderStatus
 */
export function normalizeOrderStatus(rawStatus?: string): OrderStatus {
  if (!rawStatus) return 'Pending';
  const s = rawStatus.toLowerCase().trim();
  if (s === 'completed' || s === 'delivered') return 'Completed';
  if (s === 'processing' || s === 'in_progress') return 'Processing';
  if (s === 'accepted' || s === 'confirmed' || s === 'approved') return 'Confirmed';
  if (s === 'cancelled' || s === 'canceled' || s === 'rejected' || s === 'declined') return 'Cancelled';
  return 'Pending';
}

/**
 * Get human-readable status banner text based on the real Firestore status
 */
export function getOrderStatusBannerText(status: OrderStatus | string): string {
  const normalized = normalizeOrderStatus(status);
  switch (normalized) {
    case 'Confirmed':
      return '✅ Order Confirmed — Your order has been accepted.';
    case 'Processing':
      return '⚡ Order Processing — Top-up in progress.';
    case 'Completed':
      return '🎉 Order Completed — Your items have been successfully delivered!';
    case 'Cancelled':
      return '❌ Order Cancelled / Rejected — Please contact support for assistance.';
    case 'Pending':
    default:
      return '⏳ Order Pending — Your order is submitted and awaiting confirmation.';
  }
}

/**
 * Convert Firestore document data into typed OrderItem
 */
export function parseFirestoreOrderDoc(id: string, data: any): OrderItem {
  const rawStatus = data.status || data.orderStatus || 'Pending';
  const displayStatus = normalizeOrderStatus(rawStatus);

  return {
    orderId: data.orderId || id,
    productId: data.productId || '',
    productName: data.productName || 'Product',
    productCategory: data.productCategory || 'gaming',
    productSubCategory: data.productSubCategory,
    productImage: data.productImage || '/babistorelogo.jpg',
    packageId: data.packageId || '',
    packageName: data.packageName || 'Standard Package',
    packageUnit: data.packageUnit || 'Units',
    quantity: data.quantity || 1,
    amount: data.amount || 0,
    totalPrice: data.totalPrice || 0,
    paymentMethod: data.paymentMethod || 'Telebirr',
    paymentAccount: data.paymentAccount,
    transactionId: data.transactionId || data.customerInfo?.transaction_id,
    paymentStatus: data.paymentStatus || 'Paid',
    orderStatus: displayStatus,
    customerInfo: data.customerInfo || {},
    telegramUser: data.telegramUser || { id: 0, username: '', firstName: 'Customer' },
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    notes: data.notes
  };
}

/**
 * Generate unique order ID in format BABI-XXXXX
 */
export function generateBabiOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timestampSuffix = Date.now().toString().slice(-4);
  return `BABI-${rand}${timestampSuffix.slice(-2)}`;
}

export interface CreateOrderParams {
  product: Product;
  selectedPackage: ProductPackage;
  quantity: number;
  paymentMethod: string;
  paymentAccount?: string;
  transactionId: string;
  customerInfo: Record<string, string>;
  telegramUser: {
    id: number;
    username: string;
    firstName: string;
    lastName?: string;
  };
  notes?: string;
}

/**
 * Create a new order in Firestore and save order ID locally
 */
export async function createFirestoreOrder(params: CreateOrderParams): Promise<OrderItem> {
  const orderId = generateBabiOrderId();
  const nowIso = new Date().toISOString();
  const totalPrice = Number((params.selectedPackage.price * params.quantity).toFixed(2));
  const amount = (params.selectedPackage.amount || 1) * params.quantity;

  const orderData: any = {
    orderId,
    productId: params.product.id,
    productName: params.product.name,
    productCategory: params.product.category,
    productSubCategory: params.product.subCategory,
    productImage: params.product.image,
    packageId: params.selectedPackage.id,
    packageName: params.selectedPackage.name,
    packageUnit: params.selectedPackage.unit,
    quantity: params.quantity,
    amount,
    price: params.selectedPackage.price,
    totalPrice,
    paymentMethod: params.paymentMethod,
    paymentAccount: params.paymentAccount || '',
    transactionId: params.transactionId,
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    status: 'pending', // exact lowercase status for admin dashboard
    customerInfo: {
      ...params.customerInfo,
      transaction_id: params.transactionId,
      payment_gateway: params.paymentMethod
    },
    telegramUser: {
      id: params.telegramUser.id,
      username: params.telegramUser.username || 'user',
      firstName: params.telegramUser.firstName || 'Customer',
      lastName: params.telegramUser.lastName || ''
    },
    notes: params.notes || `Order created via BABI STORE Mini App.`,
    createdAt: nowIso,
    updatedAt: nowIso,
    serverCreatedAt: serverTimestamp()
  };

  // Save to Firestore at /orders/{orderId}
  const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
  await setDoc(orderDocRef, orderData);

  // Save locally in customer's browser storage
  saveLocalOrderId(orderId);

  return parseFirestoreOrderDoc(orderId, orderData);
}

/**
 * Fetch a single order by ID directly from /orders/{orderId}
 */
export async function fetchOrderByIdFromFirestore(orderId: string): Promise<OrderItem | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return parseFirestoreOrderDoc(docSnap.id, docSnap.data());
  } catch (err) {
    console.error(`Error fetching order /orders/${orderId}:`, err);
    return null;
  }
}

/**
 * Fetch orders for a user and any locally placed orders from Firestore
 */
export async function fetchUserOrdersFromFirestore(telegramUserId: number): Promise<OrderItem[]> {
  try {
    const ordersMap = new Map<string, OrderItem>();

    // 1. Fetch by telegram user ID
    if (telegramUserId) {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const q = query(ordersRef, where('telegramUser.id', '==', telegramUserId));
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        ordersMap.set(docSnap.id, parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
      });
    }

    // 2. Fetch locally saved customer order IDs from /orders/{orderId}
    const localIds = getLocalOrderIds();
    await Promise.all(
      localIds.map(async (id) => {
        if (!ordersMap.has(id)) {
          const ord = await fetchOrderByIdFromFirestore(id);
          if (ord) ordersMap.set(id, ord);
        }
      })
    );

    const results = Array.from(ordersMap.values());
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return results;
  } catch (err) {
    console.error('Error fetching orders from Firestore:', err);
    return [];
  }
}

/**
 * Real-time onSnapshot listener for customer orders.
 * Automatically synchronizes changes from Admin (e.g. pending -> accepted -> processing -> completed)
 */
export function subscribeToUserOrders(
  telegramUserId: number,
  onOrdersUpdated: (orders: OrderItem[]) => void
): Unsubscribe {
  const unsubscribers: Unsubscribe[] = [];
  const ordersMap = new Map<string, OrderItem>();

  const emitUpdatedOrders = () => {
    const sorted = Array.from(ordersMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    onOrdersUpdated(sorted);
  };

  // 1. Listen to Telegram user orders collection
  if (telegramUserId) {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('telegramUser.id', '==', telegramUserId)
    );

    const unsubQuery = onSnapshot(
      q,
      (snapshot) => {
        snapshot.forEach((docSnap) => {
          ordersMap.set(docSnap.id, parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
        });
        emitUpdatedOrders();
      },
      (error) => {
        console.warn('User orders onSnapshot query listener error:', error);
      }
    );
    unsubscribers.push(unsubQuery);
  }

  // 2. Listen to each locally saved customer order document in /orders/{orderId}
  const localIds = getLocalOrderIds();
  localIds.forEach((id) => {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const unsubDoc = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          ordersMap.set(docSnap.id, parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
          emitUpdatedOrders();
        }
      },
      (error) => {
        console.warn(`Order doc onSnapshot listener error for ${id}:`, error);
      }
    );
    unsubscribers.push(unsubDoc);
  });

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Real-time onSnapshot listener for a single specific order document /orders/{orderId}
 */
export function subscribeToOrder(
  orderId: string,
  onOrderUpdated: (order: OrderItem | null) => void
): Unsubscribe {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        onOrderUpdated(parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
      } else {
        onOrderUpdated(null);
      }
    },
    (error) => {
      console.warn(`Single order onSnapshot listener error for ${orderId}:`, error);
    }
  );
}

