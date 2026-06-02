'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UploadProofDto = void 0;

/**
 * Body the frontend sends when uploading a payment screenshot
 * {
 *   imageBase64: "data:image/png;base64,...",
 *   orderId?: "...",
 *   note?: "...",
 *   apartmentNumber?: "...",
 *   postalCode?: "...",
 *   streetAddress?: "...",
 *   city?: "...",
 *   country?: "...",
 *   paymentMethod?: "...",
 *   transactionId?: "...",
 *   amountPaid?: 0.00,
 *   currency?: "...",
 *   paymentDate?: "..."
 * }
 */
class UploadProofDto {
  constructor({
    // --- Existing fields ---
    imageBase64 = null,
    orderId = null,
    note = null,

    // --- New Address fields ---
    streetAddress = null,
    apartmentNumber = null,
    city = null,
    postalCode = null,
    country = null,

    // --- New Payment detail fields ---
    paymentMethod = null,
    transactionId = null,
    amountPaid = null,
    currency = 'USD',
    paymentDate = null,
  } = {}) {
    // Existing fields
    this.imageBase64 = imageBase64;
    this.orderId = orderId;
    this.note = note;

    // Address fields
    this.streetAddress = streetAddress;
    this.apartmentNumber = apartmentNumber;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;

    // Payment detail fields
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
    this.amountPaid = amountPaid;
    this.currency = currency;
    this.paymentDate = paymentDate;
  }

  /**
   * Basic validation — returns an array of error messages.
   * Returns an empty array if everything is valid.
   */
  validate() {
    const errors = [];

    if (!this.imageBase64) {
      errors.push('imageBase64 is required.');
    }

    if (this.postalCode && !/^\d{3,10}$/.test(this.postalCode)) {
      errors.push('postalCode must be a numeric string between 3 and 10 digits.');
    }

    if (this.amountPaid !== null && (isNaN(this.amountPaid) || this.amountPaid < 0)) {
      errors.push('amountPaid must be a non-negative number.');
    }

    if (this.paymentDate && isNaN(Date.parse(this.paymentDate))) {
      errors.push('paymentDate must be a valid ISO date string.');
    }

    return errors;
  }

  /**
   * Serialize only the fields needed for the API request body.
   */
  toPayload() {
    return {
      imageBase64: this.imageBase64,
      orderId: this.orderId,
      note: this.note,
      address: {
        streetAddress: this.streetAddress,
        apartmentNumber: this.apartmentNumber,
        city: this.city,
        postalCode: this.postalCode,
        country: this.country,
      },
      payment: {
        paymentMethod: this.paymentMethod,
        transactionId: this.transactionId,
        amountPaid: this.amountPaid,
        currency: this.currency,
        paymentDate: this.paymentDate,
      },
    };
  }
}

exports.UploadProofDto = UploadProofDto;
//# sourceMappingURL=upload-proof.dto.js.map
