import { MenuItemInfo } from "../../types";
import { useEffect, useState } from "react";
import { MenuItemCard } from "../../components/MenuItemCard";
import { getAuth } from "firebase/auth";
import { database } from "../../firebase";
import { get, ref } from "firebase/database";

function Favourites() {
  const [items, setItems] = useState<MenuItemInfo[]>([]);

  useEffect((): void => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    const favouritesRef = ref(database, `Users/${uid}/Favourites`);
    get(favouritesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const favouritedItemsPromises = Object.values<{
          key: string;
          restaurant: string;
          category: string;
        }>(data).map((item) => {
          const { key, restaurant, category } = item; // Declare the 'category' variable here
          const databaseRef = ref(database, `${restaurant}/${category}/${key}`);
          return get(databaseRef).then((snapshot) => {
            return { val: snapshot, category, key, restaurant };
          });
        });

        Promise.all(favouritedItemsPromises).then((favouritedItems) => {
          const values: MenuItemInfo[] = favouritedItems.map(
            ({ val, category, key, restaurant }) => {
              return { ...val.val(), category, key, restaurant };
            },
          );
          setItems(values);
        });
      }
    });
  });

  return (
    <>
      <h1>Favourites</h1>
      {items.map((info) => (
        <MenuItemCard info={info} />
      ))}
    </>
  );
}

export { Favourites };
