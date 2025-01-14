const BuyXPayYPromotion = require('../BuyXPayYPromotion');
const { UnprocessableEntityError } = require('../../../../shared/errors/CustomErrors');

jest.mock('../../../../shared/errors/CustomErrors', () => ({
    UnprocessableEntityError: jest.fn().mockImplementation(function (message) {
        this.message = message;
        this.name = 'UnprocessableEntityError';
    }),
}));

describe('BuyXPayYPromotion', () => {
    describe('constructor', () => {
        test('should create an instance with valid inputs', () => {
            const promo = new BuyXPayYPromotion('promo-001', 'Buy 3 Pay 2', false, { buy: 3, pay: 2 });
            expect(promo.id).toBe('promo-001');
            expect(promo.name).toBe('Buy 3 Pay 2');
            expect(promo.type).toBe('buyXPayY');
            expect(promo.vipOnly).toBe(false);
            expect(promo.buy).toBe(3);
            expect(promo.pay).toBe(2);
        });

        test('should throw UnprocessableEntityError if customConfig is missing or invalid', () => {
            const invalidConfigs = [
                null,
                undefined,
                { buy: 0, pay: 2 },
                { buy: 3, pay: 0 },
                { buy: -3, pay: -2 },
            ];
            invalidConfigs.forEach((config) => {
                expect(() => new BuyXPayYPromotion('promo-001', 'Invalid Promo', false, config))
                    .toThrow(UnprocessableEntityError);
            });
        });
    });

    describe('apply', () => {
        test('should calculate discount correctly with a single set', () => {
            const promo = new BuyXPayYPromotion('promo-101', 'Buy 3 Pay 2', false, { buy: 3, pay: 2 });
            const cartItems = [
                { productId: 'p1', price: 10, quantity: 2 },  // 20
                { productId: 'p2', price: 5, quantity: 2 },   // 10
                { productId: 'p3', price: 12, quantity: 1 },  // 12
            ];
            // Total = 42. We have 5 items, so sets = floor(5/3)=1, freeItemsCount= 1*(3-2)=1.
            // The cheapest item is 5, so discount=5 => discountInCents=500
            // So final: totalInCents=4200, discountInCents=500, subtotalInCents=3700
            promo.apply(cartItems);
            expect(promo.totalInCents).toBe(4200);
            expect(promo.discountInCents).toBe(500);
            expect(promo.subtotalInCents).toBe(3700);
        });

        test('should calculate discount correctly with multiple sets', () => {
            const promo = new BuyXPayYPromotion('promo-102', 'Buy 3 Pay 2', false, { buy: 3, pay: 2 });
            const cartItems = [
                { productId: 'p1', price: 10, quantity: 3 }, // 30
                { productId: 'p2', price: 5, quantity: 3 },  // 15
                { productId: 'p3', price: 20, quantity: 1 }, // 20
            ];
            // Total = 65. We have 7 items. sets= floor(7/3)=2 => freeItemsCount=2*(3-2)=2
            // The 2 cheapest items are each 5 => discount=10 => discountInCents=1000
            // totalInCents=6500 => subtotalInCents=5500
            promo.apply(cartItems);
            expect(promo.totalInCents).toBe(6500);
            expect(promo.discountInCents).toBe(1000);
            expect(promo.subtotalInCents).toBe(5500);
        });

        test('should handle empty cart gracefully', () => {
            const promo = new BuyXPayYPromotion('promo-103', 'Buy 3 Pay 2', false, { buy: 3, pay: 2 });
            promo.apply([]);
            expect(promo.totalInCents).toBe(0);
            expect(promo.discountInCents).toBe(0);
            expect(promo.subtotalInCents).toBe(0);
        });

        test('should give discount if we have exactly X items (Buy 4 Pay 3)', () => {
            const promo = new BuyXPayYPromotion('promo-104', 'Buy 4 Pay 3', false, { buy: 4, pay: 3 });
            const cartItems = [
                { productId: 'p1', price: 10, quantity: 3 }, // 30
                { productId: 'p2', price: 6, quantity: 1 }, // 6
            ];
            // Total = 36. We have 4 items => sets= floor(4/4)=1 => freeItemsCount=1*(4-3)=1
            // Cheaper item = 6 => discount=6 => discountInCents=600 => subtotal=30 => 3000
            promo.apply(cartItems);
            expect(promo.totalInCents).toBe(3600);
            expect(promo.discountInCents).toBe(600);
            expect(promo.subtotalInCents).toBe(3000);
        });

        test('should throw an error if cartItems is invalid', () => {
            const promo = new BuyXPayYPromotion('promo-105', 'Buy 3 Pay 2', false, { buy: 3, pay: 2 });
            expect(() => promo.apply(null)).toThrow(Error);
            expect(() => promo.apply(undefined)).toThrow(Error);
            expect(() => promo.apply('invalid-data')).toThrow(Error);
        });
    });
});