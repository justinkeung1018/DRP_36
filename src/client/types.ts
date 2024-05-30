interface RestaurantInfo {
  name: string;
  waitTime: number;
  location: string;
  img: string;
}

interface MenuItemInfo {
  name: string;
  sides?: string;
  price: string;
  dietaryRequirements?: string[];
  availability: number;
  img: string;
}

export { RestaurantInfo, MenuItemInfo };
