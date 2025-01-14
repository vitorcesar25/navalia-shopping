const CartItem = require('../CartItem');
const { NotFoundError, UnprocessableEntityError } = require('../../../../shared/errors/CustomErrors');

jest.mock('../../../../shared/errors/CustomErrors', () => ({
    NotFoundError: jest.fn().mockImplementation(function (message) {
        this.message = message;
        this.name = 'NotFoundError';
    }),
    UnprocessableEntityError: jest.fn().mockImplementation(function (message) {
        this.message = message;
        this.name = 'UnprocessableEntityError';
    }),
}));

describe('CartItem', () => {
    test('should initialize with productId and quantity', () => {
        const item = new CartItem('prod-001', 2);

        expect(item.productId).toBe('prod-001');
        expect(item.quantity).toBe(2);
        expect(item.name).toBeUndefined();
        expect(item.price).toBeUndefined();
        expect(item.priceInCents).toBeUndefined();
        expect(item.photo).toBeUndefined();
    });

    test('should throw UnprocessableEntityError for invalid productId', () => {
        expect(() => new CartItem('', 2)).toThrow(UnprocessableEntityError);
        expect(UnprocessableEntityError).toHaveBeenCalledWith('Product ID must be a non-empty string');

        expect(() => new CartItem(123, 2)).toThrow(UnprocessableEntityError);
        expect(UnprocessableEntityError).toHaveBeenCalledWith('Product ID must be a non-empty string');
    });

    test('should throw UnprocessableEntityError for invalid quantity', () => {
        expect(() => new CartItem('prod-001', 0)).toThrow(UnprocessableEntityError);
        expect(UnprocessableEntityError).toHaveBeenCalledWith('Quantity must be a positive number');

        expect(() => new CartItem('prod-001', -5)).toThrow(UnprocessableEntityError);
        expect(UnprocessableEntityError).toHaveBeenCalledWith('Quantity must be a positive number');
    });

    test('should enrich the item with metadata', () => {
        const item = new CartItem('prod-001', 2);
        const metadata = { name: 'T-shirt', price: 35.99, photo: 'tshirt.jpg' };

        item.enrich(metadata);

        expect(item.name).toBe(metadata.name);
        expect(item.price).toBe(metadata.price);
        expect(item.priceInCents).toBe(metadata.price * 100);
        expect(item.photo).toBe(metadata.photo);
    });

    test('should throw NotFoundError if metadata is null', () => {
        const item = new CartItem('prod-001', 2);

        expect(() => item.enrich(null)).toThrow(NotFoundError);
        expect(NotFoundError).toHaveBeenCalledWith('Product with ID prod-001 not found');
    });

    test('should throw NotFoundError if metadata is undefined', () => {
        const item = new CartItem('prod-001', 2);

        expect(() => item.enrich(undefined)).toThrow(NotFoundError);
        expect(NotFoundError).toHaveBeenCalledWith('Product with ID prod-001 not found');
    });

    test('should enrich with default values if metadata fields are missing', () => {
        const item = new CartItem('prod-001', 2);
        const metadata = {};

        item.enrich(metadata);

        expect(item.name).toBe('Unknown Product');
        expect(item.price).toBe(0);
        expect(item.priceInCents).toBe(0);
        expect(item.photo).toBe('');
    });

    test('should serialize to a plain object with productId and quantity', () => {
        const item = new CartItem('prod-001', 2);
        const serialized = item.serialize();

        expect(serialized).toEqual({
            productId: 'prod-001',
            quantity: 2,
        });
    });

    test('should handle enriching with partial metadata', () => {
        const item = new CartItem('prod-001', 2);
        const metadata = { name: 'T-shirt' };

        item.enrich(metadata);

        expect(item.name).toBe(metadata.name);
        expect(item.price).toBe(0);
        expect(item.priceInCents).toBe(0);
        expect(item.photo).toBe('');
    });
});