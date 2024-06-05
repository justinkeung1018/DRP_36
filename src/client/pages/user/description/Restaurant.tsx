import { database } from "../../../firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";

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

import { RestaurantInfo, MenuItemInfo } from "../../../types";
import { IconContext } from "react-icons";
import { MenuItemCard } from "../../../components/MenuItemCard";

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
    Record<string, Record<string, MenuItemInfo>>
  >({});
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const restaurantRef = ref(database, name);
    const unsubscribe = onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        setItems(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [name]);

  return (
    <>
      <RestaurantHeader info={info} />
      <Input
        placeholder="Search For an Item"
        onChange={(e) => {
          setUserInput(e.target.value.toLowerCase().replace(/\s+/g, ""));
        }}
      />
      <Tabs defaultValue="Food">
        <div className="flex items-center justify-center mb-4 pb-1">
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
                {Object.values(items).map((item: MenuItemInfo) => {
                  if (
                    item.name
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(userInput)
                  ) {
                    return <MenuItemCard info={item} />;
                  }
                })}
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
