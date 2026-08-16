import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, STORE_CATEGORIES, PAYMENT_METHODS, STORE_CONFIG } from './src/data/catalog.ts';
import { OrderItem, OrderStatus, Product } from './src/types.ts';

// In-memory mock database state (ready to connect to PostgreSQL / Firestore)
let productsDatabase: Product[] = [...INITIAL_PRODUCTS];
let ordersDatabase: OrderItem[] = [];

function generateOrderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BABI-${result}`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'BABI STORE API', timestamp: new Date().toISOString() });
  });

  // Store Configuration
  app.get('/api/config', (_req, res) => {
    res.json({
      success: true,
      config: STORE_CONFIG,
      paymentMethods: PAYMENT_METHODS
    });
  });

  // Categories
  app.get('/api/categories', (_req, res) => {
    res.json({
      success: true,
      categories: STORE_CATEGORIES
    });
  });

  // Products List
  app.get('/api/products', (req, res) => {
    const { category, subCategory, search, popular } = req.query;
    let list = [...productsDatabase];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    if (subCategory && subCategory !== 'all') {
      list = list.filter((p) => p.subCategory === subCategory);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q)
      );
    }

    if (popular === 'true') {
      list = list.filter((p) => p.isPopular);
    }

    res.json({
      success: true,
      total: list.length,
      products: list
    });
  });

  // Single Product
  app.get('/api/products/:id', (req, res) => {
    const product = productsDatabase.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, product });
  });

  // Create Order
  app.post('/api/orders', (req, res) => {
    try {
      const {
        productId,
        packageId,
        quantity = 1,
        paymentMethod,
        paymentAccount,
        transactionId,
        customerInfo,
        telegramUser
      } = req.body;

      const product = productsDatabase.find((p) => p.id === productId);
      if (!product) {
        return res.status(400).json({ success: false, error: 'Invalid product selected' });
      }

      const pkg = product.packages.find((p) => p.id === packageId);
      if (!pkg) {
        return res.status(400).json({ success: false, error: 'Invalid package selected' });
      }

      // Check required fields
      for (const field of product.requiredFields) {
        if (field.required && (!customerInfo || !customerInfo[field.id]?.trim())) {
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field.label}`
          });
        }
      }

      const orderId = generateOrderId();
      const totalPrice = Number((pkg.price * (Number(quantity) || 1)).toFixed(2));

      const newOrder: OrderItem = {
        orderId,
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
        productImage: product.image,
        packageId: pkg.id,
        packageName: pkg.name,
        packageUnit: pkg.unit,
        quantity: Number(quantity) || 1,
        amount: pkg.amount * (Number(quantity) || 1),
        totalPrice,
        paymentMethod: paymentMethod || 'Telebirr',
        paymentAccount: paymentAccount || undefined,
        transactionId: transactionId || customerInfo?.transaction_id || undefined,
        paymentStatus: 'Paid',
        orderStatus: 'Pending',
        customerInfo: customerInfo || {},
        guestId: req.body.guestId || undefined,
        customerType: telegramUser && telegramUser.id > 0 ? 'telegram' : 'guest',
        telegramUser: telegramUser || {
          id: 0,
          username: '',
          firstName: 'Customer'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: `Order created via BABI STORE Mini App. Automated dispatch initiated.`
      };

      ordersDatabase.unshift(newOrder);

      res.status(201).json({
        success: true,
        order: newOrder
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err?.message || 'Server error creating order' });
    }
  });

  // Get Orders
  app.get('/api/orders', (req, res) => {
    const { telegramUserId, guestId, status, search } = req.query;
    let list = [...ordersDatabase];

    if (telegramUserId) {
      const uid = Number(telegramUserId);
      if (!isNaN(uid) && uid > 0) {
        list = list.filter((o) => o.telegramUser?.id === uid);
      }
    } else if (guestId && typeof guestId === 'string') {
      list = list.filter((o) => o.guestId === guestId);
    }

    if (status && status !== 'all') {
      list = list.filter((o) => o.orderStatus.toLowerCase() === (status as string).toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.productName.toLowerCase().includes(q) ||
          o.packageName.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      total: list.length,
      orders: list
    });
  });

  // Get Order by ID
  app.get('/api/orders/:id', (req, res) => {
    const order = ordersDatabase.find(
      (o) => o.orderId.toUpperCase() === req.params.id.toUpperCase()
    );
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order });
  });

  // Update Order Status (Admin/Fulfillment hook)
  app.patch('/api/orders/:id/status', (req, res) => {
    const { status, notes } = req.body;
    const validStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    const order = ordersDatabase.find(
      (o) => o.orderId.toUpperCase() === req.params.id.toUpperCase()
    );
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    if (notes) {
      order.notes = notes;
    }

    res.json({ success: true, order });
  });

  // Telegram Bot Simulator & Webhook Endpoint
  app.post('/api/bot/command', (req, res) => {
    const { command, user } = req.body;
    const userName = user?.first_name || user?.username || 'Gamer';

    switch (command) {
      case '/start':
      case 'start':
        res.json({
          success: true,
          reply: `👋 Welcome to <b>BABI STORE</b>, ${userName}!\n\n<i>Gaming • Telegram • Social Services</i>\n\n⚡ Instant automated delivery 24/7\n🎮 eFootball (Android & iPhone), FC Mobile, PUBG UC & Free Fire\n⭐ Official Telegram Stars & Premium\n📈 Snapchat Premium, TikTok Coins & Facebook Boost\n\nTap <b>Open BABI STORE</b> below to explore our instant catalog:`,
          buttons: [
            { text: '🛍️ Open Store', action: 'open_app' },
            { text: '📦 My Orders', action: 'my_orders' },
            { text: '💬 Support', action: 'support' }
          ]
        });
        break;

      case 'my_orders':
      case '/orders': {
        const userId = user?.id;
        const userOrders = userId && userId > 0
          ? ordersDatabase.filter((o) => o.telegramUser?.id === userId)
          : [];
        if (userOrders.length === 0) {
          res.json({
            success: true,
            reply: `📦 <b>You have no active orders.</b>\n\nBrowse BABI STORE to place your first instant order!`,
            buttons: [{ text: '🛍️ Browse Store', action: 'open_app' }]
          });
        } else {
          const orderSummary = userOrders
            .slice(0, 3)
            .map(
              (o) =>
                `• <b>#${o.orderId}</b>: ${o.productName} (${o.packageName})\n  Status: <code>${o.orderStatus}</code> | ${o.totalPrice.toLocaleString()} BIRR`
            )
            .join('\n\n');

          res.json({
            success: true,
            reply: `📦 <b>Your Recent Orders (${userOrders.length}):</b>\n\n${orderSummary}\n\nTap below to view full order tracking in the Mini App:`,
            buttons: [
              { text: '📱 View Full Orders', action: 'open_orders' },
              { text: '🛍️ Open Store', action: 'open_app' }
            ]
          });
        }
        break;
      }

      case 'support':
      case '/support':
        res.json({
          success: true,
          reply: `💬 <b>BABI STORE Support Team</b>\n\nNeed assistance with an order or top-up?\n• <b>Telegram Support:</b> @${STORE_CONFIG.supportUsername}\n• <b>Response time:</b> ~2 minutes\n• <b>Available:</b> 24/7\n\nHave your <b>Order ID (BABI-XXXXX)</b> ready for instant assistance!`,
          buttons: [
            { text: '💬 Contact Support Agent', action: 'open_support_chat' },
            { text: '🛍️ Back to Store', action: 'open_app' }
          ]
        });
        break;

      default:
        res.json({
          success: true,
          reply: `🤖 Unrecognized command. Please tap one of the buttons below to navigate BABI STORE:`,
          buttons: [
            { text: '🛍️ Open Store', action: 'open_app' },
            { text: '📦 My Orders', action: 'my_orders' },
            { text: '💬 Support', action: 'support' }
          ]
        });
    }
  });

  // Webhook for real bot integration (ready for production deployment)
  app.post('/api/bot/webhook', (req, res) => {
    // Acknowledges Telegram webhook updates
    res.json({ ok: true, received: true });
  });

  // Static files in public
  app.use(express.static(path.join(process.cwd(), 'public')));

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BABI STORE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
