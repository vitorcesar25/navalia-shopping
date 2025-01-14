const Product = require('../Product');
const { UnprocessableEntityError } = require('../../../../shared/errors/CustomErrors');

jest.mock('../../../../shared/errors/CustomErrors', () => ({
    UnprocessableEntityError: jest.fn().mockImplementation(function (message) {
        this.message = message;
        this.name = 'UnprocessableEntityError';
    }),
}));

describe('Product', () => {
    test('should create a Product instance with valid inputs', () => {
        const product = new Product('prod-001', 'Test Product', 29.99);

        expect(product.id).toBe('prod-001');
        expect(product.name).toBe('Test Product');
        expect(product.price).toBe(29.99);
        expect(product.priceInCents).toBe(2999);
        expect(product.photo).toBe('');
    });

    test('should use provided priceInCents if it matches calculated value', () => {
        const product = new Product('prod-002', 'Another Product', 15.5, 1550);

        expect(product.priceInCents).toBe(1550);
    });

    test('should throw UnprocessableEntityError for inconsistent priceInCents', () => {
        expect(() => new Product('prod-003', 'Invalid Product', 10, 1500))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith(
            'Inconsistent price and priceInCents values'
        );
    });

    test('should throw UnprocessableEntityError for negative price', () => {
        expect(() => new Product('prod-004', 'Negative Price', -5))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith('Price cannot be negative');
    });

    test('should throw UnprocessableEntityError for negative priceInCents', () => {
        expect(() => new Product('prod-005', 'Negative PriceInCents', 5, -500))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith('Price cannot be negative');
    });

    test('should throw UnprocessableEntityError for empty ID', () => {
        expect(() => new Product('', 'No ID', 10))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith(
            'Product ID must be a non-empty string'
        );
    });

    test('should throw UnprocessableEntityError for non-string ID', () => {
        expect(() => new Product(123, 'Invalid ID', 10))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith(
            'Product ID must be a non-empty string'
        );
    });

    test('should throw UnprocessableEntityError for empty name', () => {
        expect(() => new Product('prod-006', '', 10))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith(
            'Product name must be a non-empty string'
        );
    });

    test('should throw UnprocessableEntityError for non-string name', () => {
        expect(() => new Product('prod-007', 123, 10))
            .toThrow(UnprocessableEntityError);

        expect(UnprocessableEntityError).toHaveBeenCalledWith(
            'Product name must be a non-empty string'
        );
    });

    test('should serialize to a plain object', () => {
        const product = new Product('prod-008', 'Serializable Product', 19.99, null, 'photo.jpg');
        const serialized = product.serialize();

        expect(serialized).toEqual({
            id: 'prod-008',
            name: 'Serializable Product',
            price: 19.99,
            priceInCents: 1999,
            photo: 'photo.jpg',
        });
    });

    test('should set default values for optional properties', () => {
        const product = new Product('prod-009', 'Default Product', 5);

        expect(product.photo).toBe('');
    });
});