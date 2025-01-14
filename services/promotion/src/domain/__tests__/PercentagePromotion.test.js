const PercentagePromotion = require("../PercentagePromotion");
const {UnprocessableEntityError} = require("../../../../shared/errors/CustomErrors");

// Mock dependencies
jest.mock("../../../../shared/errors/CustomErrors", () => ({
  UnprocessableEntityError: jest.fn().mockImplementation(function(message) {
    this.message = message;
    this.name = "UnprocessableEntityError";
  }),
}));

describe("PercentagePromotion", () => {
  describe("constructor", () => {
    test("should create an instance with valid inputs", () => {
      const promotion = new PercentagePromotion("promo-001", "10% Off", false, {percentage: 10});

      expect(promotion.id).toBe("promo-001");
      expect(promotion.name).toBe("10% Off");
      expect(promotion.type).toBe("percentage");
      expect(promotion.vipOnly).toBe(false);
      expect(promotion.percentage).toBe(10);
    });

    test("should throw UnprocessableEntityError if customConfig is missing or invalid", () => {
      expect(() => new PercentagePromotion("promo-002", "Invalid Promo", false, null))
          .toThrow(UnprocessableEntityError);
      expect(UnprocessableEntityError).toHaveBeenCalledWith(
          "Percentage is required for percentage-based promotions",
      );

      expect(() => new PercentagePromotion("promo-003", "Invalid Promo", false, {percentage: 0}))
          .toThrow(UnprocessableEntityError);
      expect(UnprocessableEntityError).toHaveBeenCalledWith(
          "Percentage is required for percentage-based promotions",
      );

      expect(() => new PercentagePromotion("promo-004", "Invalid Promo", false, {percentage: 110}))
          .toThrow(UnprocessableEntityError);
      expect(UnprocessableEntityError).toHaveBeenCalledWith(
          "Percentage is required for percentage-based promotions",
      );
    });
  });

  describe("apply", () => {
    test("should calculate discount correctly for valid cart items", () => {
      const promotion = new PercentagePromotion("promo-001", "10% Off", false, {percentage: 10});

      const cartItems = [
        {productId: "prod-001", price: 30.0, quantity: 2},
        {productId: "prod-002", price: 20.0, quantity: 1},
      ];

      promotion.apply(cartItems);

      expect(promotion.totalInCents).toBe(8000); // $80.00 total
      expect(promotion.discountInCents).toBe(800); // $8.00 discount
      expect(promotion.subtotalInCents).toBe(7200); // $72.00 subtotal
    });

    test("should handle empty cart gracefully", () => {
      const promotion = new PercentagePromotion("promo-001", "10% Off", false, {percentage: 10});

      promotion.apply([]);

      expect(promotion.totalInCents).toBe(0);
      expect(promotion.discountInCents).toBe(0);
      expect(promotion.subtotalInCents).toBe(0);
    });

    test("should apply percentage discount correctly with fractional cents", () => {
      const promotion = new PercentagePromotion("promo-002", "15% Off", false, {percentage: 15});

      const cartItems = [
        {productId: "prod-001", price: 19.99, quantity: 1},
        {productId: "prod-002", price: 49.99, quantity: 1},
      ];

      promotion.apply(cartItems);

      expect(promotion.totalInCents).toBe(6998); // $69.98 total
      expect(promotion.discountInCents).toBe(1050); // $10.50 discount
      expect(promotion.subtotalInCents).toBe(5948); // $59.48 subtotal
    });

    test("should throw an error if cartItems is invalid", () => {
      const promotion = new PercentagePromotion("promo-001", "10% Off", false, {percentage: 10});

      expect(() => promotion.apply(null)).toThrow();
      expect(() => promotion.apply(undefined)).toThrow();
    });

    test("should calculate discount for cart with large quantities", () => {
      const promotion = new PercentagePromotion("promo-003", "25% Off", false, {percentage: 25});

      const cartItems = [
        {productId: "prod-001", price: 100.0, quantity: 10},
        {productId: "prod-002", price: 50.0, quantity: 20},
      ];

      promotion.apply(cartItems);

      expect(promotion.totalInCents).toBe(200000); // $2000.00 total
      expect(promotion.discountInCents).toBe(50000); // $500.00 discount
      expect(promotion.subtotalInCents).toBe(150000); // $1500.00 subtotal
    });
  });
});
