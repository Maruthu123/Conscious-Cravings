// Edit this block to change contact details, hours, or socials —
// every part of the app reads from here.
export const BUSINESS = {
  name: 'Conscious Cravings',
  city: 'Dindigul',
  address: [
    '81F, Naicker New Street, 3rd Lane,',
    'East Govindapuram, Dindigul – 624001'
  ],

  // ---- Contact number (call + WhatsApp) ----
  // phone        -> used for tel: links
  // phoneDisplay -> what the visitor sees on screen
  // whatsapp     -> country code (91) + number, NO +, NO spaces.
  //                 wa.me only works with this exact format.
  phone: '7708946388',
  phoneDisplay: '77089 46388',
  whatsapp: '917708946388',

  hours: 'Orders taken daily, 8:00 AM – 8:00 PM',

  instagram: 'cons_ciouscravings',

  // Exact Instagram profile
  instagramUrl: 'https://www.instagram.com/cons_ciouscravings/',
};

// Builds a wa.me deep link. On mobile this opens the WhatsApp app,
// on desktop it opens WhatsApp Web — both land on a chat with the
// number above, with the message pre-typed.
export function whatsappLink(message = '') {
  const digits = String(BUSINESS.whatsapp).replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export function phoneLink() {
  return `tel:+91${String(BUSINESS.phone).replace(/\D/g, '')}`;
}

export function instagramLink() {
  return BUSINESS.instagramUrl;
}

export function orderMessage(dayLabel, meal) {
  return `Hi ${BUSINESS.name}! I'd like to order ${meal.name} from ${dayLabel} (₹${meal.price}).\n\nMy name:\nDelivery address:\nQuantity:`;
}
