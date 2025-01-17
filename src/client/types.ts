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
  category: string;
  key: string;
  restaurant: string;
  timestamp?: number;
}

interface MenuItemInfoNoKey {
  gf: boolean;
  nf: boolean;
  image: string;
  name: string;
  price: number;
  quantity: number;
  v: boolean;
  vg: boolean;
  timestamp?: number;
}

export { RestaurantInfo, MenuItemInfo, MenuItemInfoNoKey };
