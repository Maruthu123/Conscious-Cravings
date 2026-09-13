// Edit this block to change contact details, hours, or socials —
// every part of the app reads from here.
export const BUSINESS = {
  name: 'Conscious Cravings',
  city: 'Dindigul',
  address: [
    '81F, Naicker New Street, 3rd Lane,',
    'East Govindapuram, Dindigul – 624001'
  ],
  phone: '9342994638',
  phoneDisplay: '93429 94638',
  hours: 'Orders taken daily, 8:00 AM – 8:00 PM',

  whatsapp: '919342994638',

  instagram: 'cons_ciouscravings',

  // Exact Instagram profile
  instagramUrl: 'https://www.instagram.com/cons_ciouscravings/',
};

export function whatsappLink(message = '') {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function phoneLink() {
  return `tel:${BUSINESS.phone}`;
}

export function instagramLink() {
  return BUSINESS.instagramUrl;
}

export function orderMessage(dayLabel, meal) {
  return `Hi ${BUSINESS.name}! I'd like to order ${meal.name} from ${dayLabel} (₹${meal.price}).\n\nMy name:\nDelivery address:\nQuantity:`;
}