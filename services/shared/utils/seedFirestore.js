const firestore = require('../configs/firestore.config');

const seedData = async () => {
    try {
        // Seed Cart
        const cartRef = firestore.collection('carts').doc('user1');
        await cartRef.set({
            items: [
                { productId: 'prod-001', quantity: 2 },
                { productId: 'prod-002', quantity: 1 },
            ],
        });

        // Seed Products
        const products = [
            { id: 'prod-001', name: 'T-shirt', price: 35.99, priceInCents: 3599, photo: 'tshirt.jpg' },
            { id: 'prod-002', name: 'Jeans', price: 65.50, priceInCents: 6550, photo: 'jeans.jpg' },
            { id: 'prod-003', name: 'Dress', price: 80.75, priceInCents: 8075, photo: 'dress.jpg' },
        ];

        for (const product of products) {
            const productRef = firestore.collection('products').doc(product.id);
            await productRef.set({ ...product });
        }

        // Seed Promotions
        const promotions = [
            {
                id: 'promo-001',
                name: 'VIP Discount (15%)',
                active: true,
                type: 'percentage',
                customConfig: { percentage: 15 },
                vipOnly: true,
            },
            {
                id: 'promo-002',
                active: true,
                name: 'Get 3 for the Price of 2',
                type: 'buy-x-pay-y',
                customConfig: { buy: 3, pay: 2 },
                vipOnly: false,
            },
        ];

        for (const promotion of promotions) {
            const promoRef = firestore.collection('promotions').doc(promotion.id);
            await promoRef.set({ ...promotion });
        }

        console.log('Firestore seeded successfully!');
    } catch (error) {
        console.error('Error seeding Firestore:', error);
    }
};

seedData();