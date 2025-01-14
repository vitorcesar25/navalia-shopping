const { fetchProductsByIds, getProducts } = require('../getProducts.usecase');
const productRepository = require('../../infrastructure/repositories/product.repository');
const Product = require('../../domain/Product');
const { NotFoundError } = require('../../../../shared/errors/CustomErrors');

jest.mock('../../infrastructure/repositories/product.repository', () => ({
    getProducts: jest.fn(),
    fetchProductsByIds: jest.fn(),
}));

jest.mock('../../domain/Product', () => {
    return jest.fn().mockImplementation((id, name, price, priceInCents, photo) => ({
        id,
        name,
        price,
        priceInCents,
        photo,
    }));
});

jest.mock('../../../../shared/errors/CustomErrors', () => ({
    NotFoundError: jest.fn().mockImplementation(function (message) {
        this.message = message;
        this.name = 'NotFoundError';
    }),
}));

describe('Product Use Cases', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getProducts', () => {
        test('should fetch products and map them to domain entities', async () => {
            const mockProductData = [
                { id: 'prod-001', name: 'Product 1', price: 10, priceInCents: 1000, photo: 'photo1.jpg' },
                { id: 'prod-002', name: 'Product 2', price: 20, priceInCents: 2000, photo: 'photo2.jpg' },
            ];

            productRepository.getProducts.mockResolvedValue(mockProductData);

            const result = await getProducts(2);

            expect(productRepository.getProducts).toHaveBeenCalledWith(2, null);
            expect(result.products).toHaveLength(2);
            expect(result.products[0]).toEqual(
                new Product('prod-001', 'Product 1', 10, 1000, 'photo1.jpg')
            );
            expect(result.nextPageToken).toBe('prod-002');
        });

        test('should handle pagination correctly when limit is reached', async () => {
            const mockProductData = Array(10).fill().map((_, index) => ({
                id: `prod-${index + 1}`,
                name: `Product ${index + 1}`,
                price: 10 * (index + 1),
                priceInCents: 1000 * (index + 1),
                photo: `photo${index + 1}.jpg`,
            }));

            productRepository.getProducts.mockResolvedValue(mockProductData);

            const result = await getProducts(10);

            expect(result.nextPageToken).toBe('prod-10');
        });

        test('should set nextPageToken to null if fewer products are fetched than limit', async () => {
            const mockProductData = [
                { id: 'prod-001', name: 'Product 1', price: 10, priceInCents: 1000, photo: 'photo1.jpg' },
            ];

            productRepository.getProducts.mockResolvedValue(mockProductData);

            const result = await getProducts(10);

            expect(result.nextPageToken).toBeNull();
        });

        test('should throw an error if productRepository.getProducts fails', async () => {
            productRepository.getProducts.mockRejectedValue(new Error('Database error'));

            await expect(getProducts(10)).rejects.toThrow('Database error');
            expect(productRepository.getProducts).toHaveBeenCalled();
        });
    });

    describe('fetchProductsByIds', () => {
        test('should fetch products by IDs and map them to domain entities', async () => {
            const mockProductData = [
                { id: 'prod-001', name: 'Product 1', price: 10, priceInCents: 1000, photo: 'photo1.jpg' },
                { id: 'prod-002', name: 'Product 2', price: 20, priceInCents: 2000, photo: 'photo2.jpg' },
            ];

            productRepository.fetchProductsByIds.mockResolvedValue(mockProductData);

            const result = await fetchProductsByIds(['prod-001', 'prod-002']);

            expect(productRepository.fetchProductsByIds).toHaveBeenCalledWith(['prod-001', 'prod-002']);
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual(
                new Product('prod-001', 'Product 1', 10, 1000, 'photo1.jpg')
            );
        });

        test('should throw NotFoundError if any product IDs are missing', async () => {
            const mockProductData = [
                { id: 'prod-001', name: 'Product 1', price: 10, priceInCents: 1000, photo: 'photo1.jpg' },
            ];

            // Simulate the repository returning only one product instead of two
            productRepository.fetchProductsByIds.mockResolvedValue(mockProductData);

            try {
                await fetchProductsByIds(['prod-001', 'prod-002']);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundError);
                expect(error.message).toBe('Products with the following IDs were not found: prod-002');
            }

            expect(productRepository.fetchProductsByIds).toHaveBeenCalledWith(['prod-001', 'prod-002']);
            expect(NotFoundError).toHaveBeenCalledWith('Products with the following IDs were not found: prod-002');
        });

        test('should handle an empty productIds array gracefully', async () => {
            productRepository.fetchProductsByIds.mockResolvedValue([]);

            const result = await fetchProductsByIds([]);

            expect(productRepository.fetchProductsByIds).toHaveBeenCalledWith([]);
            expect(result).toEqual([]);
        });

        test('should throw an error if productRepository.fetchProductsByIds fails', async () => {
            productRepository.fetchProductsByIds.mockRejectedValue(new Error('Database error'));

            await expect(fetchProductsByIds(['prod-001'])).rejects.toThrow('Database error');
            expect(productRepository.fetchProductsByIds).toHaveBeenCalledWith(['prod-001']);
        });

        test('should handle non-string product IDs by throwing an error', async () => {
            productRepository.fetchProductsByIds.mockRejectedValue(new Error('Invalid product IDs'));

            await expect(fetchProductsByIds([123, 'prod-002'])).rejects.toThrow('Invalid product IDs');
            expect(productRepository.fetchProductsByIds).toHaveBeenCalledWith([123, 'prod-002']);
        });
    });
});