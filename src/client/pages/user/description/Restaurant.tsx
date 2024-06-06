import { database } from "../../../firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { Search } from "lucide-react";

import { AspectRatio } from "../../../components/shadcn/AspectRatio";
import { Button } from "../../../components/shadcn/Button";
import { Separator } from "../../../components/shadcn/Separator";
import { Input } from "../../../components/shadcn/Input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../components/shadcn/Tabs";

import { RestaurantInfo, MenuItemInfoNoKey } from "../../../types";
import { IconContext } from "react-icons";
import { MenuItemCard } from "../../../components/MenuItemCard";
import { getAuth } from "firebase/auth";

function RestaurantHeader({ info }: { info: RestaurantInfo }) {
  const { name, location, img } = info;
  return (
    <>
      <AspectRatio ratio={20 / 9} className="mb-4">
        <img
          src={img}
          alt="Restaurant image"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <div className="flex flex-col items-center justify-center mb-4">
        <h1 className="text-xl font-bold">{name}</h1>
        <p>{location}</p>
      </div>
      <Separator className="mb-2" />
      <h1 className="text-xl text-center font-bold mx-4 py-2">Menu</h1>
    </>
  );
}

const Restaurant = () => {
  const location = useLocation();
  const { info } = location.state;
  const { name } = info;
  const [items, setItems] = useState<
    Record<string, Record<string, MenuItemInfoNoKey>>
  >({});
  const [userInput, setUserInput] = useState("");
  const [dietary, setDietary] = useState({
    gf: false,
    nf: false,
    v: false,
    vg: false,
  });

  useEffect(() => {
    const restaurantRef = ref(database, name);
    const unsubscribe = onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        for (const category in data) {
          for (const item in data[category]) {
            if (dietary.gf && !data[category][item].gf) {
              delete data[category][item];
            } else if (dietary.nf && !data[category][item].nf) {
              delete data[category][item];
            } else if (dietary.v && !data[category][item].v) {
              delete data[category][item];
            } else if (dietary.vg && !data[category][item].vg) {
              delete data[category][item];
            }
          }
        }
        setItems(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [name, dietary]);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    const dietaryRef = ref(database, `Users/${uid}/Dietary`);
    onValue(dietaryRef, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        setDietary(data);
      }
    });
  });

  return (
    <>
      <RestaurantHeader info={info} />
      <Tabs defaultValue="Food">
        <div className="flex items-center justify-center mb-2">
          <TabsList>
            {(Object.keys(items).length === 0
              ? ["Drink", "Food"]
              : Object.keys(items)
            )
              .reverse()
              .map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
          </TabsList>
        </div>
        <div className="px-4 mb-4">
          <Input
            placeholder="Search for an item"
            startIcon={Search}
            onChange={(e) => {
              setUserInput(e.target.value.toLowerCase().replace(/\s+/g, ""));
            }}
          />
        </div>
        {Object.keys(items).length === 0
          ? ["Drink", "Food"].map((category) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4 overflow-auto text-center font-bold text-l"
              >
                No Items
              </TabsContent>
            ))
          : Object.entries(items).map(([category, items]) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4 overflow-auto"
              >
                {Object.entries(items).map(
                  ([key, item]: [string, MenuItemInfoNoKey]) => {
                    if (
                      item.name
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .includes(userInput)
                    ) {
                      return (
                        <MenuItemCard
                          info={{ ...item, category, key, restaurant: name }}
                        />
                      );
                    }
                  },
                )}
              </TabsContent>
            ))}
      </Tabs>
      <Button asChild>
        <Link to="/" className="fixed top-5 left-5 bg-stone-700/60 px-1">
          <IconContext.Provider value={{ color: "#a8a29e", size: "30px" }}>
            <IoChevronBack />
          </IconContext.Provider>
        </Link>
      </Button>
    </>
  );
};

export { Restaurant };
