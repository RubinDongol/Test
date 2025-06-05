export const RECIPEDATA = [
  {
    id: '1',
    recipeName: 'Spaghetti Carbonara',
    reviews: 12,
    imageUrl:
      'https://images.pexels.com/photos/28978147/pexels-photo-28978147.jpeg',
  },
  {
    id: '2',
    recipeName: 'Chicken Tikka Masala',
    reviews: 42,
    imageUrl:
      'https://images.pexels.com/photos/12312104/pexels-photo-12312104.jpeg',
  },
  {
    id: '3',
    recipeName: 'Beef Wellington',
    reviews: 8,
    imageUrl:
      'https://images.pexels.com/photos/11267448/pexels-photo-11267448.jpeg',
  },
  {
    id: '4',
    recipeName: 'Sushi Rolls',
    reviews: 61,
    imageUrl:
      'https://images.pexels.com/photos/4725593/pexels-photo-4725593.jpeg',
  },
  {
    id: '5',
    recipeName: 'Ratatouille',
    reviews: 45,
    imageUrl:
      'https://images.pexels.com/photos/2998934/pexels-photo-2998934.jpeg',
  },
  {
    id: '6',
    recipeName: 'Pad Thai',
    reviews: 19,
    imageUrl:
      'https://images.pexels.com/photos/10756648/pexels-photo-10756648.jpeg',
  },
  {
    id: '7',
    recipeName: 'Tiramisu',
    reviews: 37,
    imageUrl:
      'https://images.pexels.com/photos/12035685/pexels-photo-12035685.jpeg',
  },
];

export type RecipeDataType = (typeof RECIPEDATA)[0];

export const PREMIUM_RECIPEDATA: RecipeDataType[] = [
  {
    id: '1',
    recipeName: 'Lobster Bisque',
    reviews: 30,
    imageUrl:
      'https://images.pexels.com/photos/17598232/pexels-photo-17598232/free-photo-of-a-bowl-of-soup-with-shrimp-tomatoes-and-herbs.jpeg', // Lobster Bisque
  },
  {
    id: '2',
    recipeName: 'Truffle Mac and Cheese',
    reviews: 25,
    imageUrl:
      'https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Truffle Mac and Cheese
  },
  {
    id: '3',
    recipeName: 'Filet Mignon with Garlic Butter',
    reviews: 18,
    imageUrl:
      'https://images.pexels.com/photos/5863615/pexels-photo-5863615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Filet Mignon
  },
  {
    id: '4',
    recipeName: 'Duck Breast with Orange Sauce',
    reviews: 22,
    imageUrl:
      'https://images.pexels.com/photos/8697525/pexels-photo-8697525.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Duck Breast with Orange Sauce
  },
  {
    id: '5',
    recipeName: 'Lamb Chops with Mint Jelly',
    reviews: 40,
    imageUrl:
      'https://images.pexels.com/photos/13304044/pexels-photo-13304044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Lamb Chops
  },
];

export const USER_REVIEWS = [
  {
    id: '1',
    userName: 'John Doe',
    review:
      'This recipe was absolutely delicious, with perfect balance of flavors and textures. The chef nailed it!',
  },
  {
    id: '2',
    userName: 'Lisa Miller',
    review:
      'The dish was beautifully presented and full of vibrant flavors. The chef’s attention to detail is impressive.',
  },
  {
    id: '3',
    userName: 'Michael Smith',
    review:
      'A fantastic recipe! The combination of ingredients was unique, and the chef’s technique was spot on.',
  },
  {
    id: '4',
    userName: 'Sophia Johnson',
    review:
      'The chef’s twist on this classic recipe was brilliant, resulting in a flavorful and satisfying meal.',
  },
  {
    id: '5',
    userName: 'David Lee',
    review:
      'I loved how this recipe was easy to follow, yet the final result felt gourmet. Kudos to the chef!',
  },
  {
    id: '6',
    userName: 'Rita Green',
    review:
      'The recipe was full of fresh ingredients and bold flavors. The chef really knows how to bring it all together.',
  },
  {
    id: '7',
    userName: 'Alex Brown',
    review:
      'What a fantastic dish! The chef’s innovative use of ingredients made this recipe a true winner.',
  },
];

export type UserReviewType = (typeof USER_REVIEWS)[0];
