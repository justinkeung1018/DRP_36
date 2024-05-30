import { useLocation } from "react-router-dom";

import { AspectRatio } from "../../components/shadcn/AspectRatio";
import { Badge } from "../../components/shadcn/Badge";
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
      <h1 className="text-xl text-center font-bold mx-4 py-2">Menu</h1>
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
  const { gf, nf, image, name, price, quantity, v, vg } = info;
  const { name: mainName, description } = parseMenuName(name);

  let availabilityColour;
  if (quantity > 30) {
    availabilityColour = "border-green-700 text-green-700";
  } else if (quantity > 10) {
    availabilityColour = "border-amber-700 text-amber-700";
  } else {
    availabilityColour = "border-red-700 text-red-700";
  }

  return (
    <>
      <Card className="px-4 border-none shadow-none">
        <div className="basis-3/4 flex justify-between gap-x-2">
          <div>
            <CardHeader className="p-0 text-lg font-medium leading-tight">
              {mainName}
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center gap-x-1">
                <div className="text-gray-500 font-light">£{price}</div>
                {(v || vg || gf || nf) && <div>·</div>}
                {v && <Badge className="bg-green-700 px-1.5 py-0.25">V</Badge>}
                {vg && <Badge className="bg-lime-400 px-1.5 py-0.25">VG</Badge>}
                {gf && <Badge className="bg-sky-600 px-1.5 py-0.25">GF</Badge>}
                {nf && (
                  <Badge className="bg-fuchsia-700 px-1.5 py-0.25">NF</Badge>
                )}
              </div>

              <div className="text-gray-500 font-light leading-tight">
                {description}
              </div>
              <Badge variant="outline" className={"mt-2 " + availabilityColour}>
                Availability: {quantity}
              </Badge>
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
                {Object.values(items).map((item: MenuItemInfo) => (
                  <MenuItemCard info={item} />
                ))}
              </TabsContent>
            ))}
      </Tabs>
    </>
  );
};

export { MenuItemCard, Restaurant };
