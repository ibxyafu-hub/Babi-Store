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
import { getOrCreateGuestId } from '../context/TelegramContext';

export const ORDERS_COLLECTION = 'orders';
const LOCAL_STORAGE_ORDER_IDS_KEY = 'babi_store_customer_order_ids';

/**
 * Local Storage helpers for tracking placed customer order IDs across visits on this device
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

  const rawTgUsername = data.telegramUsername || data.telegramUser?.username || '';
  const formattedTgUsername = rawTgUsername
    ? (rawTgUsername.startsWith('@') ? rawTgUsername : `@${rawTgUsername}`)
    : '';

  const tgId = data.telegramId || data.telegramUser?.id || (data.customerType === 'telegram' ? data.userId : undefined);
  const tgFirstName = data.telegramFirstName || data.telegramUser?.firstName || data.telegramUser?.first_name || '';
  const tgLastName = data.telegramLastName || data.telegramUser?.lastName || data.telegramUser?.last_name || '';

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
    status: rawStatus,
    customerInfo: data.customerInfo || {},
    guestId: data.guestId || undefined,
    customerType: data.customerType || (tgId ? 'telegram' : 'guest'),
    telegramId: tgId ? Number(tgId) || tgId : null,
    telegramUsername: formattedTgUsername,
    telegramFirstName: tgFirstName,
    telegramLastName: tgLastName,
    telegramUser: {
      id: Number(tgId) || 0,
      username: formattedTgUsername ? formattedTgUsername.replace(/^@/, '') : '',
      firstName: tgFirstName || 'Customer',
      lastName: tgLastName || ''
    },
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
  telegramId?: number | string | null;
  telegramUsername?: string;
  telegramFirstName?: string;
  telegramLastName?: string;
  telegramUser?: {
    id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
  guestId?: string;
  isGuest?: boolean;
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

  const rawTgId = params.telegramId || params.telegramUser?.id;
  const isRealTelegramUser = Boolean(
    !params.isGuest && rawTgId && Number(rawTgId) > 0
  );
  const currentGuestId = isRealTelegramUser
    ? undefined
    : params.guestId || getOrCreateGuestId();

  const telegramId = isRealTelegramUser ? Number(rawTgId) : null;
  const rawUsername = isRealTelegramUser
    ? (params.telegramUsername || params.telegramUser?.username || '').trim()
    : '';
  const telegramUsername = rawUsername
    ? (rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`)
    : '';
  const telegramFirstName = isRealTelegramUser
    ? (params.telegramFirstName || params.telegramUser?.firstName || '').trim()
    : '';
  const telegramLastName = isRealTelegramUser
    ? (params.telegramLastName || params.telegramUser?.lastName || '').trim()
    : '';

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
    guestId: currentGuestId || null,
    customerType: isRealTelegramUser ? 'telegram' : 'guest',
    // Root level fields for Admin Orders Dashboard
    telegramId: isRealTelegramUser ? telegramId : null,
    telegramUsername: isRealTelegramUser ? telegramUsername : '',
    telegramFirstName: isRealTelegramUser ? telegramFirstName : '',
    telegramLastName: isRealTelegramUser ? telegramLastName : '',
    telegramUser: isRealTelegramUser
      ? {
          id: telegramId!,
          username: telegramUsername ? telegramUsername.replace(/^@/, '') : '',
          firstName: telegramFirstName || 'Customer',
          lastName: telegramLastName || ''
        }
      : {
          id: 0,
          username: '',
          firstName: 'Guest Customer'
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

export interface CustomerIdentityParams {
  telegramUserId?: number;
  guestId?: string;
  isGuest?: boolean;
}

/**
 * Fetch orders strictly belonging to the active customer identity
 */
export async function fetchCustomerOrdersFromFirestore(
  identity: CustomerIdentityParams
): Promise<OrderItem[]> {
  try {
    const ordersMap = new Map<string, OrderItem>();

    // 1. If real Telegram user: ONLY fetch orders with matching telegramUser.id
    if (!identity.isGuest && identity.telegramUserId && identity.telegramUserId > 0) {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const q = query(ordersRef, where('telegramUser.id', '==', identity.telegramUserId));
      const snapshot = await getDocs(q);
      snapshot.forEach((docSnap) => {
        ordersMap.set(docSnap.id, parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
      });
    } else {
      // 2. If Web Guest user: ONLY fetch orders matching this device's guestId
      const currentGuestId = identity.guestId || getOrCreateGuestId();
      if (currentGuestId) {
        const ordersRef = collection(db, ORDERS_COLLECTION);
        const qGuest = query(ordersRef, where('guestId', '==', currentGuestId));
        const snapshotGuest = await getDocs(qGuest);
        snapshotGuest.forEach((docSnap) => {
          ordersMap.set(docSnap.id, parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
        });
      }

      // Also retrieve this device's locally saved order IDs
      const localIds = getLocalOrderIds();
      await Promise.all(
        localIds.map(async (id) => {
          if (!ordersMap.has(id)) {
            const ord = await fetchOrderByIdFromFirestore(id);
            if (ord) {
              // Ensure order either matches this guest or was placed anonymously on this device
              if (!ord.telegramUser?.id || ord.guestId === currentGuestId) {
                ordersMap.set(id, ord);
              }
            }
          }
        })
      );
    }

    const results = Array.from(ordersMap.values());
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return results;
  } catch (err) {
    console.error('Error fetching customer orders from Firestore:', err);
    return [];
  }
}

/**
 * Legacy wrapper for fetchUserOrdersFromFirestore
 */
export async function fetchUserOrdersFromFirestore(
  telegramUserId: number,
  guestId?: string
): Promise<OrderItem[]> {
  return fetchCustomerOrdersFromFirestore({
    telegramUserId,
    guestId: guestId || getOrCreateGuestId(),
    isGuest: !telegramUserId || telegramUserId <= 0
  });
}

/**
 * Real-time onSnapshot listener for customer orders.
 * Automatically synchronizes changes from Admin in real time strictly for the active customer identity.
 */
export function subscribeToCustomerOrders(
  identity: CustomerIdentityParams,
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

  // 1. Real Telegram user listener
  if (!identity.isGuest && identity.telegramUserId && identity.telegramUserId > 0) {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('telegramUser.id', '==', identity.telegramUserId)
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
        console.warn('Telegram user orders onSnapshot error:', error);
      }
    );
    unsubscribers.push(unsubQuery);
  } else {
    // 2. Web Guest device listener
    const currentGuestId = identity.guestId || getOrCreateGuestId();
    if (currentGuestId) {
      const qGuest = query(
        collection(db, ORDERS_COLLECTION),
        where('guestId', '==', currentGuestId)
      );

      const unsubGuest = onSnapshot(
        qGuest,
        (snapshot) => {
          snapshot.forEach((docSnap) => {
            ordersMap.set(docSnap.id, parseFirestoreOrderDoc(docSnap.id, docSnap.data()));
          });
          emitUpdatedOrders();
        },
        (error) => {
          console.warn('Guest orders onSnapshot error:', error);
        }
      );
      unsubscribers.push(unsubGuest);
    }

    // Also listen to this device's locally saved orders
    const localIds = getLocalOrderIds();
    localIds.forEach((id) => {
      const docRef = doc(db, ORDERS_COLLECTION, id);
      const unsubDoc = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const parsed = parseFirestoreOrderDoc(docSnap.id, docSnap.data());
            if (!parsed.telegramUser?.id || parsed.guestId === currentGuestId) {
              ordersMap.set(docSnap.id, parsed);
              emitUpdatedOrders();
            }
          }
        },
        (error) => {
          console.warn(`Order doc onSnapshot listener error for ${id}:`, error);
        }
      );
      unsubscribers.push(unsubDoc);
    });
  }

  return () => {
    unsubscribers.forEach((unsub) => unsub());
  };
}

/**
 * Legacy wrapper for subscribeToUserOrders
 */
export function subscribeToUserOrders(
  telegramUserId: number,
  onOrdersUpdated: (orders: OrderItem[]) => void,
  guestId?: string
): Unsubscribe {
  return subscribeToCustomerOrders(
    {
      telegramUserId,
      guestId: guestId || getOrCreateGuestId(),
      isGuest: !telegramUserId || telegramUserId <= 0
    },
    onOrdersUpdated
  );
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


