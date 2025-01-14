const { clearCartByUserId } = require('../clearCart.usecase');
const cartRepository = require('../../infrastructure/repositories/cart.repository');
const Cart = require('../../domain/Cart');

jest.mock('../../infrastructure/repositories/cart.repository', () => ({
    clearCartByUserId: jest.fn(),
}));

jest.mock('../../domain/Cart', () => {
    return jest.fn().mockImplementation((userId, items) => {
        return { userId, items };
    });
});

describe('clearCartByUserId', () => {
    const mockUserId = 'user-001';

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should clear the cart and return a new empty Cart instance', async () => {
        cartRepository.clearCartByUserId.mockResolvedValue();
        const result = await clearCartByUserId(mockUserId);

        expect(cartRepository.clearCartByUserId).toHaveBeenCalledTimes(1);
        expect(cartRepository.clearCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).toHaveBeenCalledTimes(1);
        expect(Cart).toHaveBeenCalledWith(mockUserId, []);
        expect(result).toEqual({ userId: mockUserId, items: [] });
    });

    test('should throw an error if cartRepository.clearCartByUserId fails', async () => {
        cartRepository.clearCartByUserId.mockRejectedValue(
            new Error('Database error')
        );

        await expect(clearCartByUserId(mockUserId)).rejects.toThrow('Database error');
        expect(cartRepository.clearCartByUserId).toHaveBeenCalledTimes(1);
        expect(cartRepository.clearCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).not.toHaveBeenCalled();
    });

    test('should handle invalid userId gracefully', async () => {
        const invalidUserId = null;
        cartRepository.clearCartByUserId.mockImplementation(() => {
            throw new Error('Invalid user ID');
        });

        await expect(clearCartByUserId(invalidUserId)).rejects.toThrow('Invalid user ID');
        expect(cartRepository.clearCartByUserId).toHaveBeenCalledTimes(1);
        expect(cartRepository.clearCartByUserId).toHaveBeenCalledWith(invalidUserId);
        expect(Cart).not.toHaveBeenCalled();
    });

    test('should return a new Cart instance even if the user already has an empty cart', async () => {
        cartRepository.clearCartByUserId.mockResolvedValue();

        const result = await clearCartByUserId(mockUserId);

        expect(cartRepository.clearCartByUserId).toHaveBeenCalledTimes(1);
        expect(cartRepository.clearCartByUserId).toHaveBeenCalledWith(mockUserId);
        expect(Cart).toHaveBeenCalledTimes(1);
        expect(Cart).toHaveBeenCalledWith(mockUserId, []);
        expect(result).toEqual({ userId: mockUserId, items: [] });
    });
});