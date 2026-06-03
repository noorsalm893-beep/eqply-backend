'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UploadProofDto = void 0;

class UploadProofDto {
  constructor({
    imageBase64 = null,
    orderId = null,
    note = null,
    streetAddress = null,
    apartmentNumber = null,
    city = null,
    postalCode = null,
    country = null,
    paymentMethod = null,
    transactionId = null,
    amountPaid = null,
    currency = 'USD',
    paymentDate = null,
  } = {}) {
    this.imageBase64 = imageBase64;
    this.orderId = orderId;
    this.note = note;
    this.streetAddress = streetAddress;
    this.apartmentNumber = apartmentNumber;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
    this.amountPaid = amountPaid;
    this.currency = currency;
    this.paymentDate = paymentDate;
  }

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
}

exports.UploadProofDto = UploadProofDto;
//# sourceMappingURL=upload-proof.dto.js.map