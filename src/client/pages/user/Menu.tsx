import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { getAuth } from "firebase/auth";

import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { IconContext } from "react-icons";
import { Search } from "lucide-react";

import { AspectRatio } from "../../components/shadcn/AspectRatio";
import { Button } from "../../components/shadcn/Button";
import { Separator } from "../../components/shadcn/Separator";
import { Input } from "../../components/shadcn/Input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/shadcn/Tabs";

import { RestaurantInfo, MenuItemInfoNoKey } from "../../types";
import { getRelevantMenuItemCards } from "../../components/MenuItemCard";
import { Header } from "../../components/Header";

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

type Item = {
  likes?: number; // "likes" is optional
  [key: string]: any; // Other fields of any type are allowed
};

type Category = {
  [key: string]: Item;
};

function sortByLikesDescending(obj: any): any {
  // Helper function to sort a single category (Food or Drink)
  function sortCategory(category: Category): any {
    return Object.fromEntries(
      Object.entries(category).sort(
        ([, a], [, b]) => (b.likes || 0) - (a.likes || 0),
      ),
    );
  }

  return obj === null
    ? null
    : {
        Drink: sortCategory(obj.Drink),
        Food: sortCategory(obj.Food),
      };
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
      const data = sortByLikesDescending(snapshot.val());

      if (data != null) {
        for (const category in data) {
          for (const item in data[category]) {
            if (Date.now() - 86400000 > data[category][item].timestamp) {
              delete data[category][item];
            }
            if (dietary.gf && data[category][item] != undefined && !data[category][item].gf) {
              delete data[category][item];
            } else if (dietary.nf && data[category][item] != undefined && !data[category][item].nf) {
              delete data[category][item];
            } else if (dietary.v && data[category][item] != undefined && !data[category][item].v) {
              delete data[category][item];
            } else if (dietary.vg && data[category][item] != undefined && !data[category][item].vg) {
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
  }, []);

  return (
    <>
      <div className="main-content max-h-[92vh]">
        <RestaurantHeader info={info} />
        <Tabs defaultValue="Food">
          <div className="flex items-center justify-center mb-2">
            <TabsList>
              {["Food", "Drink"].map((category) => (
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
            ? ["Food", "Drink"].map((category) => (
                <TabsContent
                  key={category}
                  value={category}
                  className="space-y-4 overflow-auto text-center font-normal text-lg"
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
                  {getRelevantMenuItemCards(
                    items,
                    userInput,
                    category,
                    name,
                    "user",
                  )}
                </TabsContent>
              ))}
        </Tabs>
      </div>
      <Header spritePath="./images/sprites/smile.png" withBackButton>
        Check out what's on offer!
      </Header>
    </>
  );
};

export { Restaurant };
