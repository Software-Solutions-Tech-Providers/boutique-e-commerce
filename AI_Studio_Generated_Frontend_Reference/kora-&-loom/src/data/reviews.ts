import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'kanchipuram-temple-emerald',
    author: 'Ananya Sundaram',
    city: 'Chennai',
    rating: 5,
    verified: true,
    date: '14 Oct 2026',
    occasionPurchased: 'Sister’s Wedding',
    title: 'Zero stiffness and stayed pleated for 10 hours',
    comment:
      'I was worried pure Kanchipuram silk might feel bulky, but this draped in five minutes. The antique gold zari matches traditional jewellery seamlessly.',
  },
  {
    id: 'rev-2',
    productId: 'kanchipuram-temple-emerald',
    author: 'Meenakshi Iyer',
    city: 'Bengaluru',
    rating: 5,
    verified: true,
    date: '02 Nov 2026',
    occasionPurchased: 'Housewarming Puja',
    title: 'Exact emerald shade shown in the video',
    comment:
      'Used the pincode tracker and received it in 3 days. The included blouse piece had clean zari borders so I didn’t need extra lace.',
  },
  {
    id: 'rev-3',
    productId: 'maheshwari-ochre-rose',
    author: 'Kavita Deshmukh',
    city: 'Pune',
    rating: 5,
    verified: true,
    date: '29 Oct 2026',
    occasionPurchased: 'Office & Travel',
    title: 'Bought 3 for ₹2,700—best decision for daily wear',
    comment:
      'Originally opened the page for one saree, saw the Buy 3 + Free Shipping savings and picked three shades. Featherlight even in humid weather.',
  },
  {
    id: 'rev-4',
    productId: 'banarasi-katan-crimson',
    author: 'Shruti Mishra',
    city: 'Lucknow',
    rating: 5,
    verified: true,
    date: '08 Nov 2026',
    occasionPurchased: 'Diwali Evening',
    title: 'Heirloom Banarasi sheen without heavy weight',
    comment:
      'Pre-booked on Monday and it arrived by Saturday with neat hand-knotted tassels on the pallu. Paid smoothly via UPI.',
  },
  {
    id: 'rev-5',
    productId: 'kalamkari-silk-blouse',
    author: 'Divya Krishnan',
    city: 'Kochi',
    rating: 5,
    verified: true,
    date: '19 Oct 2026',
    occasionPurchased: 'Festive Pairing',
    title: 'Size chart was spot on; cotton lining feels great',
    comment:
      'Ordered size M (36") using the chest guide. Fits cleanly right out of the parcel and pairs with both my ochre and crimson sarees.',
  },
  {
    id: 'rev-6',
    productId: 'chanderi-ivory-linen',
    author: 'Nandini Rao',
    city: 'Hyderabad',
    rating: 5,
    verified: true,
    date: '05 Nov 2026',
    occasionPurchased: 'Client Presentation',
    title: 'Quiet luxury for daytime events',
    comment:
      'Crisp ivory linen-silk with just enough champagne gold to look elevated without feeling overdressed.',
  },
  {
    id: 'rev-7',
    productId: 'silk-care-kit',
    author: 'Padma Venkat',
    city: 'Coimbatore',
    rating: 5,
    verified: true,
    date: '11 Nov 2026',
    occasionPurchased: 'Monthly Subscription',
    title: 'Muslin bags saved my mother’s old Kanjeevarams',
    comment:
      'Switched from plastic covers to these mulmul bags. On the ₹450 monthly refill for cedar blocks and gentle wash.',
  },
];

export const FEATURED_TESTIMONIALS = [
  {
    name: 'Ananya Sundaram',
    role: 'Architect · Chennai',
    outcome: 'Draped for a 10-hour wedding ceremony without re-pinning once',
    quote:
      'Knowing the exact 540g weight, delivery date for my pincode, and seeing the natural daylight drape video removed all hesitation before ordering online.',
  },
  {
    name: 'Kavita Deshmukh',
    role: 'University Lecturer · Pune',
    outcome: 'Saved ₹300 + shipping on a 3-saree Maheshwari workwear bundle',
    quote:
      'I came for one ₹1,000 cotton-silk saree and upgraded to the 3-saree tier once I saw the transparent math and 7-day easy exchange policy.',
  },
  {
    name: 'Divya Krishnan',
    role: 'Product Lead · Kochi',
    outcome: 'Exchanged blouse size in 48 hours with zero tailor visits',
    quote:
      'The chest & length chart was accurate, and when my sister needed a size up, the exchange pickup happened the very next morning.',
  },
];
