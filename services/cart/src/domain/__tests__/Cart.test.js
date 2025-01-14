jest.mock("../CartItem", () => {
  return jest.fn().mockImplementation((productId, quantity) => {
    return {
      productId,
      quantity,
      priceInCents: null,
      enrich(metadata) {
        if (!metadata) {
          throw new Error(`Metadata for product ${productId} not found`);
        }
        this.priceInCents = Math.round(metadata.price * 100);
      },
      serialize() {
        return {productId, quantity: this.quantity}; // Removed priceInCents
      },
    };
  });
});

const Cart = require("../Cart");
const CartItem = require("../CartItem");

describe("Cart", () => {
  let cart;

  beforeEach(() => {
    CartItem.mockClear();

    cart = new Cart("user1", [
      {productId: "prod-001", quantity: 2},
      {productId: "prod-002", quantity: 1},
    ]);
  });

  test("should initialize with userId and items", () => {
    expect(cart.getUserId()).toBe("user1");
    expect(cart.items).toHaveLength(2);
    expect(CartItem).toHaveBeenCalledTimes(2);
    expect(CartItem).toHaveBeenCalledWith("prod-001", 2);
    expect(CartItem).toHaveBeenCalledWith("prod-002", 1);
  });

  test("should calculate the total correctly", () => {
    cart.items[0].priceInCents = 3599; // Mock item 1 price
    cart.items[1].priceInCents = 6550; // Mock item 2 price

    const total = cart.calculateTotal();
    expect(total).toBe(137.48); // Total in dollars
    expect(cart.totalInCents).toBe(13748); // Total in cents
  });

  test("should throw error if product metadata is missing in enrichItems", () => {
    expect(() => {
      cart.enrichItems([
        {id: "prod-001", name: "T-shirt", price: 35.99, photo: "tshirt.jpg"},
        // Missing metadata for 'prod-002'
      ]);
    }).toThrow("Metadata for product prod-002 not found");
  });


  test("should enrich items with product metadata", () => {
    const metadata = [
      {id: "prod-001", name: "T-shirt", price: 35.99, photo: "tshirt.jpg"},
      {id: "prod-002", name: "Jeans", price: 65.50, photo: "jeans.jpg"},
    ];

    cart.enrichItems(metadata);

    expect(CartItem).toHaveBeenCalledTimes(2);
    expect(cart.items[0].priceInCents).toBe(3599);
    expect(cart.items[1].priceInCents).toBe(6550);
  });

  test("should add a new item to the cart", () => {
    cart.addItem("prod-003", 3);

    expect(cart.items).toHaveLength(3);
    expect(CartItem).toHaveBeenCalledWith("prod-003", 3);
    const newItem = cart.items.find((item) => item.productId === "prod-003");
    expect(newItem).toBeDefined();
    expect(newItem.quantity).toBe(3);
  });

  test("should update quantity for an existing item", () => {
    cart.addItem("prod-001", 5);

    const updatedItem = cart.items.find((item) => item.productId === "prod-001");
    expect(updatedItem.quantity).toBe(5);
  });

  test("should remove item when quantity is zero", () => {
    cart.addItem("prod-002", 0);

    expect(cart.items).toHaveLength(1);
    const removedItem = cart.items.find((item) => item.productId === "prod-002");
    expect(removedItem).toBeUndefined();
  });

  test("should remove an item from the cart", () => {
    cart.removeItem("prod-001");

    expect(cart.items).toHaveLength(1);
    const removedItem = cart.items.find((item) => item.productId === "prod-001");
    expect(removedItem).toBeUndefined();
  });

  test("should serialize cart items correctly", () => {
    const serializedItems = cart.getCartItemsSerialized();

    expect(serializedItems).toHaveLength(2);
    expect(serializedItems[0]).toEqual({productId: "prod-001", quantity: 2});
    expect(serializedItems[1]).toEqual({productId: "prod-002", quantity: 1});
  });

  test("should handle empty cart gracefully", () => {
    const emptyCart = new Cart("user2");

    expect(emptyCart.items).toHaveLength(0);
    expect(emptyCart.calculateTotal()).toBe(0);
  });

  test("should handle invalid quantities correctly", () => {
    cart.addItem("prod-003", -1);

    const invalidItem = cart.items.find((item) => item.productId === "prod-003");
    expect(invalidItem).toBeUndefined();
  });
});
