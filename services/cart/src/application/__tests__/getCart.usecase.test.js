const { getCartByUserId } = require('../getCart.usecase');
const cartRepository = require('../../infrastructure/repositories/cart.repository');
const Cart = require('../../domain/Cart');

// Mock dependencies
jest.mock('../../infrastructure/repositories/cart.repository', () => ({
    getCartByUserId: jest.fn(),
}));

jest.mock('../../domain/Cart', () => {
    return jest.fn().mockImplementation((userId, items) => {
        return {
            userId,
            items,
            enrichItems: jest.fn(),
            calculateTotal: jest.fn(),
        };
    });
});

describe('getCartByUserId', () => {
    const mockUserId = 'user-001';
    const mockGetProductsMetadata = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return an empty cart if no items are found for the user', async () => {
        cartRepository.getCartByUserId.mockResolvedValue({ items: [] });

        const result = await getCartByUserId(mockUserId, mockGetProductsMetadata);

        expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).toHaveBeenCalledWith(mockUserId, []);
        expect(result.items).toEqual([]);
        expect(result.calculateTotal).toHaveBeenCalled();
    });

    test('should enrich cart items with product metadata and calculate total', async () => {
        const cartItems = [
            { productId: 'prod-001', quantity: 2 },
            { productId: 'prod-002', quantity: 1 },
        ];
        const productMetadata = [
            { id: 'prod-001', name: 'T-shirt', price: 30 },
            { id: 'prod-002', name: 'Jeans', price: 50 },
        ];

        cartRepository.getCartByUserId.mockResolvedValue({ items: cartItems });
        mockGetProductsMetadata.mockResolvedValue(productMetadata);

        const result = await getCartByUserId(mockUserId, mockGetProductsMetadata);

        expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).toHaveBeenCalledWith(mockUserId, cartItems);
        expect(result.enrichItems).toHaveBeenCalledWith(productMetadata);
        expect(result.calculateTotal).toHaveBeenCalled();
    });

    test('should throw an error if cartRepository.getCartByUserId fails', async () => {
        cartRepository.getCartByUserId.mockRejectedValue(new Error('Database error'));

        await expect(getCartByUserId(mockUserId, mockGetProductsMetadata)).rejects.toThrow(
            'Database error'
        );

        expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).not.toHaveBeenCalled();
        expect(mockGetProductsMetadata).not.toHaveBeenCalled();
    });

    test('should throw an error if getProductsMetadata fails', async () => {
        const cartItems = [
            { productId: 'prod-001', quantity: 2 },
            { productId: 'prod-002', quantity: 1 },
        ];

        cartRepository.getCartByUserId.mockResolvedValue({ items: cartItems });
        mockGetProductsMetadata.mockRejectedValue(new Error('Metadata fetch error'));

        await expect(getCartByUserId(mockUserId, mockGetProductsMetadata)).rejects.toThrow(
            'Metadata fetch error'
        );

        expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).toHaveBeenCalledWith(mockUserId, cartItems);
        expect(mockGetProductsMetadata).toHaveBeenCalledWith(['prod-001', 'prod-002']);
    });

    test('should handle cart items with missing product metadata gracefully', async () => {
        const cartItems = [
            { productId: 'prod-001', quantity: 2 },
            { productId: 'prod-002', quantity: 1 },
        ];
        const partialMetadata = [
            { id: 'prod-001', name: 'T-shirt', price: 30 },
        ];

        cartRepository.getCartByUserId.mockResolvedValue({ items: cartItems });
        mockGetProductsMetadata.mockResolvedValue(partialMetadata);

        const result = await getCartByUserId(mockUserId, mockGetProductsMetadata);

        expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).toHaveBeenCalledWith(mockUserId, cartItems);
        expect(result.enrichItems).toHaveBeenCalledWith(partialMetadata);
        expect(result.calculateTotal).toHaveBeenCalled();
    });
});