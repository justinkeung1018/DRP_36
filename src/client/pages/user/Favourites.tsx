import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { database } from "../../firebase";
import { get, onValue, ref } from "firebase/database";

import { Separator } from "../../components/shadcn/Separator";
import { MenuItemCard } from "../../components/MenuItemCard";
import { MenuItemInfo } from "../../types";

function groupItemsByRestaurant(
  items: MenuItemInfo[],
): Record<string, MenuItemInfo[]> {
  return items.reduce(
    (map, info) => {
      const { restaurant } = info;
      if (!(restaurant in map)) {
        map[restaurant] = [];
      }
      map[restaurant].push(info);
      return map;
    },
    {} as Record<string, MenuItemInfo[]>,
  );
}

function Favourites() {
  const [items, setItems] = useState<Record<string, MenuItemInfo[]>>({});

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    const favouritesRef = ref(database, `Users/${uid}/Favourites`);
    const unsubscribe = onValue(favouritesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const favouritedItemsPromises = Object.values<{
          key: string;
          restaurant: string;
          category: string;
        }>(data).flatMap((item) => {
          const { key, restaurant, category } = item; // Declare the 'category' variable here
          const databaseRef = ref(database, `${restaurant}/${category}/${key}`);
          return get(databaseRef).then((snapshot) => {
            if (!snapshot.exists()) {
              return null;
            }
            return { val: snapshot, category, key, restaurant };
          });
        });

        Promise.all(favouritedItemsPromises).then((favouritedItems) => {
          const values: MenuItemInfo[] = favouritedItems.map((item) => {
            if (item != null) {
              const { val, category, key, restaurant } = item;
              return { ...val.val(), category, key, restaurant };
            }
            return null;
          });
          setItems(groupItemsByRestaurant(values.filter((val) => val != null)));
        });
      } else {
        setItems(groupItemsByRestaurant([]));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="main-content">
      <div className="px-10">
        <div className="flex flex-col items-center justify-center mb-4 mt-10">
          <h1 className="text-2xl font-bold">Your Favourites</h1>
        </div>
      </div>
      <Separator className="mb-8" />
      <div className="space-y-4">
        {Object.entries(items).length === 0 ? (
          <h1 className="text-center text-xl font-normal">No Items</h1>
        ) : (
          Object.entries(items).map(([restaurant, restaurantItems], index) => (
            <>
              <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2 px-4">
                {restaurant}
              </h1>
              {restaurantItems.map((info, index) => (
                <MenuItemCard
                  info={info}
                  withSeparator={index < restaurantItems.length - 1}
                />
              ))}
              {index < Object.entries(items).length - 1 && (
                <Separator className="h-[5px] bg-slate-100" />
              )}
            </>
          ))
        )}
      </div>
    </div>
  );
}

export { Favourites };
