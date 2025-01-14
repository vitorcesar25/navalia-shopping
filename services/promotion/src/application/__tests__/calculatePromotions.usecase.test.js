const { calculatePromotions } = require('../calculatePromotions.usecase');
const promotionRepository = require('../../infrastructure/repositories/promotion.repository');
const BuyXPayYPromotion = require('../../domain/BuyXPayYPromotion');
const PercentagePromotion = require('../../domain/PercentagePromotion');
const { BadRequestError } = require('../../../../shared/errors/CustomErrors');

jest.mock('../../infrastructure/repositories/promotion.repository', () => ({
    getActivePromotions: jest.fn(),
}));

jest.mock('../../domain/BuyXPayYPromotion', () => {
    return jest.fn().mockImplementation((id, name, vipOnly, customConfig) => ({
        id,
        name: name || 'Default Promotion Name',
        vipOnly: vipOnly || false,
        customConfig,
        apply: jest.fn(),
        discount: customConfig.buy === 3 ? 20 : 0, // Mocked discount logic
    }));
});

jest.mock('../../domain/PercentagePromotion', () => {
    return jest.fn().mockImplementation((id, name, vipOnly, customConfig) => ({
        id,
        name,
        vipOnly,
        customConfig,
        apply: jest.fn(),
        discount: customConfig.percentage === 10 ? 10 : 0,
    }));
});

jest.mock('../../../../shared/errors/CustomErrors', () => ({
    BadRequestError: jest.fn().mockImplementation(function (message) {
        this.message = message;
        this.name = 'BadRequestError';
    }),
}));

describe('calculatePromotions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should throw an error if cart items are invalid', async () => {
        try {
            await calculatePromotions([], true);
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestError);
            expect(error.message).toBe('Cart items are required');
        }
    });

    test('should handle no applicable promotions gracefully', async () => {
        const cartItems = [{ productId: 'prod-001', price: 100, quantity: 2 }];
        const promotions = [];

        promotionRepository.getActivePromotions.mockResolvedValue(promotions);

        const result = await calculatePromotions(cartItems, true);

        expect(promotionRepository.getActivePromotions).toHaveBeenCalled();
        expect(result.promotions).toHaveLength(0);
        expect(result.bestOfferId).toBeNull();
    });

    test('should exclude VIP-only promotions for non-VIP users', async () => {
        const cartItems = [{ productId: 'prod-001', price: 100, quantity: 2 }];
        const promotions = [
            { id: 'promo-001', type: 'percentage', vipOnly: true, customConfig: { percentage: 10 } },
            { id: 'promo-002', type: 'buy-x-pay-y', vipOnly: false, customConfig: { buy: 3, pay: 2 } },
        ];

        promotionRepository.getActivePromotions.mockResolvedValue(promotions);

        const result = await calculatePromotions(cartItems, false);

        expect(promotionRepository.getActivePromotions).toHaveBeenCalled();
        expect(result.promotions).toHaveLength(1);
        expect(result.promotions[0].id).toBe('promo-002');
        expect(result.bestOfferId).toBe('promo-002');
    });

    test('should handle promotions with zero discounts', async () => {
        const cartItems = [{ productId: 'prod-001', price: 100, quantity: 2 }];
        BuyXPayYPromotion.mockImplementation(() => ({
            id: 'promo-002',
            apply: jest.fn(),
            discount: 0, // Simulate zero discount
        }));

        const promotions = [
            { id: 'promo-002', type: 'buy-x-pay-y', vipOnly: false, customConfig: { buy: 3, pay: 2 } },
        ];

        promotionRepository.getActivePromotions.mockResolvedValue(promotions);

        const result = await calculatePromotions(cartItems, true);

        expect(result.promotions).toHaveLength(0); // No promotions with discounts > 0
        expect(result.bestOfferId).toBeNull();
    });

    test('should throw an error if promotionRepository.getActivePromotions fails', async () => {
        promotionRepository.getActivePromotions.mockRejectedValue(new Error('Database error'));

        await expect(calculatePromotions([{ productId: 'prod-001', price: 100, quantity: 2 }], true))
            .rejects.toThrow('Database error');
        expect(promotionRepository.getActivePromotions).toHaveBeenCalled();
    });
});