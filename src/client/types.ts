interface RestaurantInfo {
  name: string;
  waitTime: number;
  location: string;
  img: string;
}

interface MenuItemInfo {
  gf: boolean;
  nf: boolean;
  image: string;
  name: string;
  price: number;
  quantity: number;
  v: boolean;
  vg: boolean;
}

export { RestaurantInfo, MenuItemInfo };
