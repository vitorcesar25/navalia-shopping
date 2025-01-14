const {updateCartItem} = require("../updateCartItem.usecase");
const cartRepository = require("../../infrastructure/repositories/cart.repository");
const Cart = require("../../domain/Cart");
const {BadRequestError} = require("../../../../shared/errors/CustomErrors");

jest.mock("../../infrastructure/repositories/cart.repository", () => ({
  getCartByUserId: jest.fn(),
  saveCart: jest.fn(),
}));

jest.mock("../../domain/Cart", () => {
  return jest.fn().mockImplementation((userId, items) => {
    return {
      userId,
      items,
      addItem: jest.fn(),
      removeItem: jest.fn(),
      getCartItemsSerialized: jest.fn().mockReturnValue(items),
    };
  });
});

jest.mock("../../../../shared/errors/CustomErrors", () => ({
  BadRequestError: jest.fn().mockImplementation(function(message) {
    this.message = message;
    this.name = "BadRequestError";
  }),
}));

describe("updateCartItem", () => {
  const mockUserId = "user-001";
  const mockProductId = "prod-001";

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should add an item to the cart when quantity is positive", async () => {
    const cartItems = [{productId: "prod-002", quantity: 1}];
    cartRepository.getCartByUserId.mockResolvedValue({items: cartItems});

    const mockAddItem = jest.fn();
    Cart.mockImplementation(() => ({
      addItem: mockAddItem,
      getCartItemsSerialized: jest.fn().mockReturnValue(cartItems),
      items: cartItems,
    }));

    const result = await updateCartItem(mockUserId, mockProductId, 2);

    expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
    expect(mockAddItem).toHaveBeenCalledWith(mockProductId, 2);
    expect(cartRepository.saveCart).toHaveBeenCalledWith(mockUserId, cartItems);
    expect(result).toEqual(expect.any(Object));
  });

  test("should remove an item from the cart when quantity is zero or negative", async () => {
    const cartItems = [{productId: mockProductId, quantity: 1}];
    cartRepository.getCartByUserId.mockResolvedValue({items: cartItems});

    const mockRemoveItem = jest.fn();
    Cart.mockImplementation(() => ({
      removeItem: mockRemoveItem,
      getCartItemsSerialized: jest.fn().mockReturnValue([]),
      items: [],
    }));

    const result = await updateCartItem(mockUserId, mockProductId, 0);

    expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
    expect(mockRemoveItem).toHaveBeenCalledWith(mockProductId);
    expect(cartRepository.saveCart).toHaveBeenCalledWith(mockUserId, []);
    expect(result).toEqual(expect.any(Object));
  });

  test("should throw BadRequestError if cart has more than 10 items", async () => {
    const cartItems = Array(10).fill({productId: "prod", quantity: 1});
    cartRepository.getCartByUserId.mockResolvedValue({items: cartItems});

    Cart.mockImplementation(() => ({
      addItem: jest.fn(() => {
        cartItems.push({productId: mockProductId, quantity: 1});
      }),
      items: cartItems,
    }));

    try {
      await updateCartItem(mockUserId, mockProductId, 1);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe("Cart cannot have more than 10 items.");
    }
  });

  test("should handle empty cart gracefully", async () => {
    cartRepository.getCartByUserId.mockResolvedValue(null);

    const mockAddItem = jest.fn();
    Cart.mockImplementation(() => ({
      addItem: mockAddItem,
      getCartItemsSerialized: jest.fn().mockReturnValue([]),
      items: [],
    }));

    const result = await updateCartItem(mockUserId, mockProductId, 1);

    expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
    expect(mockAddItem).toHaveBeenCalledWith(mockProductId, 1);
    expect(cartRepository.saveCart).toHaveBeenCalledWith(mockUserId, []);
    expect(result).toEqual(expect.any(Object));
  });

  test("should throw an error if cartRepository.getCartByUserId fails", async () => {
    cartRepository.getCartByUserId.mockRejectedValue(new Error("Database error"));

    await expect(updateCartItem(mockUserId, mockProductId, 1)).rejects.toThrow("Database error");
    expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
    expect(cartRepository.saveCart).not.toHaveBeenCalled();
  });

  test("should throw an error if cartRepository.saveCart fails", async () => {
    const cartItems = [{productId: mockProductId, quantity: 1}];
    cartRepository.getCartByUserId.mockResolvedValue({items: cartItems});
    cartRepository.saveCart.mockRejectedValue(new Error("Database error"));

    await expect(updateCartItem(mockUserId, mockProductId, 1)).rejects.toThrow("Database error");
    expect(cartRepository.getCartByUserId).toHaveBeenCalledWith(mockUserId);
    expect(cartRepository.saveCart).toHaveBeenCalled();
  });
});
