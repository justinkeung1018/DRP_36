import { useLocation } from "react-router-dom";

import { AspectRatio } from "../../components/shadcn/AspectRatio";
import { Card, CardContent, CardHeader } from "../../components/shadcn/Card";
import { Separator } from "../../components/shadcn/Separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/shadcn/Tabs";

import { RestaurantInfo, MenuItemInfo } from "../../types";

import { database } from "../../firebase";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

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
      <h1 className="text-lg font-bold mx-4">Menu</h1>
    </>
  );
}

function parseMenuName(name: string) {
  const splitOnWith = name.split("with");
  if (splitOnWith.length === 1) {
    const splitOnLeftParenthesis = name.split("(");
    if (splitOnLeftParenthesis.length === 1) {
      return { name, description: "" };
    }
    const [mainName, ...rest] = [
      splitOnLeftParenthesis[0],
      ...splitOnLeftParenthesis[1].split(")"),
    ];
    return { name: mainName, description: rest.join(" ") };
  }
  const [mainName, description] = splitOnWith;
  return { name: mainName, description: "with " + description };
}

function MenuItemCard({ info }: { info: MenuItemInfo }) {
  const { gf, halal, image, name, price, quantity, v, vg } = info;
  const goodName = name.replace(/"/g, "");
  const { name: mainName, description } = parseMenuName(goodName);
  return (
    <>
      <Card className="px-4 border-none shadow-none">
        <div className="basis-3/4 flex justify-between gap-x-2">
          <div>
            <CardHeader className="p-0 text-lg font-medium leading-tight">
              {mainName}
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-gray-500 font-light">£{price}</div>
              <div className="text-gray-500 font-light leading-tight">
                {description}
              </div>
            </CardContent>
          </div>
          <div className="basis-1/4 flex-none flex flex-col items-center justify-center">
            <AspectRatio ratio={1}>
              <img
                src={image}
                alt="Food"
                className="object-cover w-full h-full rounded-md"
              />
            </AspectRatio>
          </div>
        </div>
      </Card>
      <Separator className="ml-4 w-[calc(100%-4)]" />
    </>
  );
}

function capitalise(x: string): string {
  return x[0].toUpperCase() + x.slice(1);
}

const Restaurant = () => {
  const location = useLocation();
  const { info } = location.state;
  const { name } = info;
  const [items, setItems] = useState<
    Record<string, Record<string, MenuItemInfo>>
  >({});

  useEffect(() => {
    const restaurantRef = ref(database, name);
    const unsubscribe = onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      setItems(data);
    });

    return () => {
      unsubscribe();
    };
  }, [name]);

  return (
    <>
      <RestaurantHeader info={info} />
      <Tabs defaultValue="Food">
        <div className="flex items-center justify-center mb-4">
          <TabsList>
            {Object.keys(items)
              .reverse()
              .map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
          </TabsList>
        </div>
        {Object.entries(items).map(([category, items]) => (
          <TabsContent
            key={category}
            value={category}
            className="space-y-4 overflow-auto"
          >
            {Object.values(items).map((item: MenuItemInfo) => (
              <MenuItemCard info={item} /> // Assuming MenuItemInfo has an id field
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Restaurant;
