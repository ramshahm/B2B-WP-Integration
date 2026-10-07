import type { Product } from '@/data/products';

export const WHATSAPP_NUMBER = '919811011000';

export function buildWhatsAppUrl(product: Product): string {
  const message = `Hello Purnima Exports, I am an international buyer interested in reviewing a production sample for ${product.code} (${product.title}). Please share the B2B tech pack and pricing details. Image ref: ${product.image}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildDirectWhatsAppUrl(): string {
  const message =
    'Hello Purnima Exports, I am an international buyer and would like to discuss your private label manufacturing capabilities, MOQs, and export pricing for the 2026 collection.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
