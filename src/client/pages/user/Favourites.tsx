import { RestaurantInfo } from "../../types";
import RestaurantCard from "../../components/RestaurantCard";
import { useEffect, useState } from "react";

function getItems(): RestaurantInfo[] {
  // TODO: Fetch favourite items from database
  return [];
}
function Favourites() {
  const [items, setItems] = useState<RestaurantInfo[]>([]);

  useEffect(() => {
    setItems(getItems());
  }, []);

  return (
    <>
      <h1>Favourites</h1>
      {items.map((info) => (
        <RestaurantCard info={info} />
      ))}
    </>
  );
}

export { Favourites };
