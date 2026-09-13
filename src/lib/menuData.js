import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// ===================== Photo library, grouped by diet category =====================
// Used only to seed Firestore the very first time (when menu/current doesn't
// exist yet). After that, the live menu lives in Firestore and /admin
// edits it — this file is not read again once the database has data.
export const PHOTO = {
  weightLoss1: 'https://images.pexels.com/photos/3872373/pexels-photo-3872373.jpeg?auto=compress&cs=tinysrgb&w=800',
  weightLoss2: 'https://images.pexels.com/photos/3872370/pexels-photo-3872370.jpeg?auto=compress&cs=tinysrgb&w=800',
  weightLoss3: 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=800',
  weightLoss4: 'https://images.pexels.com/photos/3872365/pexels-photo-3872365.jpeg?auto=compress&cs=tinysrgb&w=800',
  gymProtein3: 'https://images.pexels.com/photos/34159112/pexels-photo-34159112/free-photo-of-traditional-indian-chicken-curry-and-rice.jpeg?auto=compress&cs=tinysrgb&w=800',
  weightGain1: 'https://images.pexels.com/photos/34159109/pexels-photo-34159109/free-photo-of-traditional-kerala-chicken-biryani-in-clay-pot.jpeg?auto=compress&cs=tinysrgb&w=800',
  weightGain2: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
  balanced1: 'https://images.pexels.com/photos/31199041/pexels-photo-31199041/free-photo-of-traditional-south-indian-idli-with-sambar-and-chutney.jpeg?auto=compress&cs=tinysrgb&w=800',
  balanced2: 'https://images.pexels.com/photos/4331489/pexels-photo-4331489.jpeg?auto=compress&cs=tinysrgb&w=800',
};

// Category label + colour used for the little tag on each meal card.
// Admins can pick any of these four categories in /admin:
//   weightLoss | gymProtein | weightGain | balanced
export const CATEGORY = {
  weightLoss: { label: 'Weight Loss', color: '#1FAA6D' },
  gymProtein: { label: 'High Protein / Gym Diet', color: '#C1381D' },
  weightGain: { label: 'Weight Gain', color: '#E2932F' },
  balanced: { label: 'Balanced Diet', color: '#5C1A16' },
};

export const DEFAULT_DAYS = [
  {
    day: 1, label: 'Day 1',
    meal1: { name: 'Meal 1', price: 220, protein: true, image: PHOTO.weightLoss1, category: 'weightLoss',
      items: ['Almonds', 'Watermelon', 'Boiled Peanut Chaat Salad', 'Boiled Eggs / Chilli Garlic Tofu', 'Podi Rice', 'Potato & Green Peas Masala', 'Amla & Ginger Drink'] },
    meal2: { name: 'Meal 2', price: 200, protein: false, image: PHOTO.balanced2, category: 'balanced',
      items: ['Vegetable Semiya Pulav', 'Thecha Paneer Yogurt Dip', 'Ragi Banana Chocolate Cake'] },
  },
  {
    day: 2, label: 'Day 2',
    meal1: { name: 'Meal 1', price: 150, protein: true, image: PHOTO.weightLoss2, category: 'weightLoss',
      items: ['Almonds', 'Muskmelon', 'White Chickpea Salad, Peanut Sauce Dressing', 'Butter Garlic Egg / Chilli Garlic Tofu', 'Rice', 'Chow-Chow Dal Kootu', 'Cider Lemonade'] },
    meal2: { name: 'Meal 2', price: 180, protein: false, image: PHOTO.weightGain2, category: 'weightGain',
      items: ['White Sauce Fusilli Pasta', 'Chilli Chicken Manchurian', 'Beetroot Oats Muffin'] },
  },
  {
    day: 3, label: 'Day 3',
    meal1: { name: 'Meal 1', price: 150, protein: false, image: PHOTO.balanced1, category: 'balanced',
      items: ['Almonds', 'Papaya', 'Horse Gram Salad', 'Egg Pancake', 'Rice', 'Bottlegourd Dal', 'Beetroot Buttermilk'] },
    meal2: { name: 'Meal 2', price: 180, protein: false, image: PHOTO.gymProtein3, category: 'gymProtein',
      items: ['Pulka', 'Hyderabadi Red Chicken Gravy', 'Mixed Fruits Custard'] },
  },
  {
    day: 4, label: 'Day 4',
    meal1: { name: 'Meal 1', price: 150, protein: false, image: PHOTO.weightLoss3, category: 'weightLoss',
      items: ['Almonds', 'Muskmelon', 'Black Chickpea Salad', 'Boiled Eggs', 'Rice', 'Pumpkin Erissery', 'Iced Lemon Tea'] },
    meal2: { name: 'Meal 2', price: 180, protein: false, image: PHOTO.weightGain1, category: 'weightGain',
      items: ['Chicken Pulao', 'Mushroom Matar Gravy', 'Orange Oats-Almond Loaf'] },
  },
  {
    day: 5, label: 'Day 5',
    meal1: { name: 'Meal 1', price: 150, protein: true, image: PHOTO.weightLoss4, category: 'weightLoss',
      items: ['Almonds', 'Watermelon', 'Rajma Bean Salad, Chipotle Dressing', 'Egg & Feta Frittata / Chilli Garlic Tofu', 'Millet Curd Rice', 'Cauliflower & Green Peas Masala', 'Watermelon Lemonade'] },
    meal2: { name: 'Meal 2', price: 170, protein: false, image: PHOTO.balanced1, category: 'balanced',
      items: ['Barnyard Millet Bisibelabath', 'Mixed Veggies Raita', 'Pumpkin Oats-Millet Pancakes'] },
  },
];

const menuDocRef = () => doc(db, 'menu', 'current');

// One-time fetch. Seeds Firestore with the default menu the very first
// time (empty database) so the site is never blank.
export async function fetchMenu() {
  const snap = await getDoc(menuDocRef());
  if (snap.exists() && snap.data().days) {
    return snap.data().days;
  }
  await setDoc(menuDocRef(), { days: DEFAULT_DAYS });
  return DEFAULT_DAYS;
}

// Live subscription — callback fires immediately and again on every
// change (e.g. right after /admin saves an edit).
export function watchMenu(callback) {
  return onSnapshot(menuDocRef(), (snap) => {
    if (snap.exists() && snap.data().days) {
      callback(snap.data().days);
    } else {
      callback(DEFAULT_DAYS);
    }
  });
}

// Used by /admin to save edits back.
export function saveMenu(days) {
  return setDoc(menuDocRef(), { days });
}
