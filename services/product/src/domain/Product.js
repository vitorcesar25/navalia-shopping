const { UnprocessableEntityError } = require('../../../shared/errors/CustomErrors');

class Product {
    constructor(id, name, price, priceInCents, photo) {
        if (!id || typeof id !== 'string') {
            throw new UnprocessableEntityError('Product ID must be a non-empty string');
        }
        if (!name || typeof name !== 'string') {
            throw new UnprocessableEntityError('Product name must be a non-empty string');
        }
        if (price < 0) {
            throw new UnprocessableEntityError('Price cannot be negative');
        }
        if (priceInCents && priceInCents !== Math.round(price * 100)) {
            throw new UnprocessableEntityError('Inconsistent price and priceInCents values');
        }

        this.id = id;
        this.name = name;
        this.price = price;
        this.priceInCents = priceInCents ?? Math.round(price * 100);
        this.photo = photo || '';
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            priceInCents: this.priceInCents,
            photo: this.photo,
        };
    }
}

module.exports = Product;