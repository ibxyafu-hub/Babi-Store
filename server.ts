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

    const defaultButtons = [
      { text: 'My Orders', action: 'my_orders' },
      { text: 'Rules', action: 'rules' },
      { text: 'Support', action: 'support' },
      { text: 'About Us', action: 'about' }
    ];

    switch (command) {
      case '/start':
      case 'start':
        res.json({
          success: true,
          reply: `Welcome to <b>BABI AI Chat</b>, ${userName}!\n\n<i>Gaming • Telegram • Social Services</i>\n\nInstant automated delivery 24/7\neFootball (Android & iPhone), FC Mobile, PUBG UC & Free Fire\nOfficial Telegram Stars & Premium\n\nChoose an action below:`,
          buttons: defaultButtons
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
            reply: `<b>You currently have no active orders.</b>\n\nWhen you place an order in BABI STORE, its live tracking, Order ID, and status will appear here.`,
            buttons: [
              { text: 'Rules', action: 'rules' },
              { text: 'Support', action: 'support' }
            ]
          });
        } else {
          const orderSummary = userOrders
            .slice(0, 5)
            .map(
              (o) =>
                `• <b>#${o.orderId}</b>: ${o.productName} (${o.packageName})\n  Status: <code>${o.orderStatus}</code> | ${o.totalPrice.toLocaleString()} BIRR`
            )
            .join('\n\n');

          res.json({
            success: true,
            reply: `<b>Your Recent Orders (${userOrders.length}):</b>\n\n${orderSummary}`,
            buttons: [
              { text: 'Rules', action: 'rules' },
              { text: 'Support', action: 'support' }
            ]
          });
        }
        break;
      }

      case 'rules':
      case '/rules':
        res.json({
          success: true,
          reply: `<b>እነዚህን አንብቡ ከመግዛታችሁ በፊት</b>\n\n1. እኛ የታዘዘውን እቃ ማቅረብ እስከቻልን ድረስ refund የለም።\n\n2. ብር ከላካችሁ በኋላ የላካችሁበትን ማስረጃ (transaction number) ሳትልኩ 20 ደቂቃ ካለፈ ተቀባይነት አይኖረውም!\n\n3. ደረሰኝ ሳይልኩ "ልኬአለው" ብሎ መከራከር ጥቅም የለውም፤ ተቀባይነት አይኖረውም።\n\n4. ክፍያ ከፈጸማችሁ በኋላ በቀኑ እቃችሁን ካልተረከባችሁ ከዛ በኋላ ላለው ሀላፊነት አንወስድም።\n\n5. ከእኛ የደረሳችሁን መልዕክት ከተቀበላችሁ በኋላ እቃው ካልደረሳችሁ በ30 ደቂቃ ውስጥ አረጋግጣችሁ ቅሬታ ማቅረብ አለባችሁ። 30 ደቂቃ ካለፈ ሀላፊነት አንወስድም።`,
          buttons: [
            { text: 'My Orders', action: 'my_orders' },
            { text: 'Support', action: 'support' }
          ]
        });
        break;

      case 'support':
      case '/support':
        res.json({
          success: true,
          reply: `Having a problem with your order or need help? Our support team is here to help. Contact us using email or Telegram.\n\n<b>Email Support:</b> apexcreativesaio@gmail.com\n<b>Telegram Support:</b> @Raf_babi`,
          buttons: [
            { text: 'My Orders', action: 'my_orders' },
            { text: 'Rules', action: 'rules' },
            { text: 'About Us', action: 'about' }
          ]
        });
        break;

      case 'about':
      case '/about':
        res.json({
          success: true,
          reply: `<b>About BABI STORE</b>\n\nBABI STORE is a digital gaming store created to make buying game products simple, fast, and convenient.\n\n<b>Our Services</b>\nWe provide digital gaming products and top-up services for popular games. Our goal is to make the ordering process easy and provide customers with a smooth experience from placing an order until delivery.\n\n<b>Trusted Service</b>\nWe work to provide a reliable and trustworthy service for our customers. Every order is handled carefully, and our support team is available to help when customers have questions or problems.\n\n<b>Our Goal</b>\nOur goal is to build a trusted gaming store where customers can easily find what they need, place their orders, and receive professional support.\n\nThank you for choosing BABI STORE`,
          buttons: [
            { text: 'My Orders', action: 'my_orders' },
            { text: 'Rules', action: 'rules' },
            { text: 'Support', action: 'support' }
          ]
        });
        break;

      default:
        res.json({
          success: true,
          reply: `I am your <b>BABI AI Assistant</b>. How can I help you? Choose one of the options below:`,
          buttons: defaultButtons
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
