const Promotion = require("../Promotion");
const {UnprocessableEntityError} = require("../../../../shared/errors/CustomErrors");

jest.mock("../../../../shared/errors/CustomErrors", () => ({
  UnprocessableEntityError: jest.fn().mockImplementation(function(message) {
    this.message = message;
    this.name = "UnprocessableEntityError";
  }),
}));

describe("Promotion", () => {
  describe("constructor", () => {
    test("should create a Promotion instance with valid inputs", () => {
      const promotion = new Promotion("promo-001", "Black Friday Sale", "percentage", true);

      expect(promotion.id).toBe("promo-001");
      expect(promotion.name).toBe("Black Friday Sale");
      expect(promotion.type).toBe("percentage");
      expect(promotion.vipOnly).toBe(true);
      expect(promotion.total).toBe(0);
      expect(promotion.discount).toBe(0);
      expect(promotion.subtotal).toBe(0);
      expect(promotion.totalInCents).toBe(0);
      expect(promotion.discountInCents).toBe(0);
      expect(promotion.subtotalInCents).toBe(0);
    });

    test("should throw UnprocessableEntityError if id, name, or type is missing", () => {
      expect(() => new Promotion("", "Black Friday Sale", "percentage", true))
          .toThrow(UnprocessableEntityError);
      expect(UnprocessableEntityError).toHaveBeenCalledWith("Promotion ID, name, and type are required");

      expect(() => new Promotion("promo-001", "", "percentage", true))
          .toThrow(UnprocessableEntityError);
      expect(UnprocessableEntityError).toHaveBeenCalledWith("Promotion ID, name, and type are required");

      expect(() => new Promotion("promo-001", "Black Friday Sale", "", true))
          .toThrow(UnprocessableEntityError);
      expect(UnprocessableEntityError).toHaveBeenCalledWith("Promotion ID, name, and type are required");
    });
  });

  describe("apply", () => {
    test("should throw an error when apply is called directly on the base class", () => {
      const promotion = new Promotion("promo-001", "Black Friday Sale", "percentage", true);
      expect(() => promotion.apply([])).toThrow("Method \"apply\" must be implemented in subclasses");
    });
  });

  describe("convertCentsToDollars", () => {
    test("should correctly convert cent-based properties to dollar values", () => {
      const promotion = new Promotion("promo-001", "Black Friday Sale", "percentage", true);
      promotion.totalInCents = 10000;
      promotion.discountInCents = 2000;
      promotion.subtotalInCents = 8000;

      promotion.convertCentsToDollars();

      expect(promotion.total).toBe(100.0);
      expect(promotion.discount).toBe(20.0);
      expect(promotion.subtotal).toBe(80.0);
    });

    test("should handle zero or undefined cent-based properties gracefully", () => {
      const promotion = new Promotion("promo-001", "Black Friday Sale", "percentage", true);

      promotion.convertCentsToDollars();

      expect(promotion.total).toBe(0);
      expect(promotion.discount).toBe(0);
      expect(promotion.subtotal).toBe(0);
    });
  });
});
