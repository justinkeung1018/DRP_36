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

function MenuItemCard({ info }: { info: MenuItemInfo }) {
  const { name, sides, price, dietaryRequirements, availability, img } = info;
  return (
    <>
      <Card className="px-4 border-none shadow-none">
        <div className="basis-3/4 flex justify-between gap-x-2">
          <div>
            <CardHeader className="p-0 text-lg font-medium leading-tight">
              {name}
            </CardHeader>
            <CardContent className="p-0">
              <div className="text-gray-500 font-light">£{price}</div>
              <div className="text-gray-500 font-light leading-tight">
                {sides}
              </div>
            </CardContent>
          </div>
          <div className="basis-1/4 flex-none flex flex-col items-center justify-center">
            <AspectRatio ratio={1}>
              <img
                src="https://hips.hearstapps.com/hmg-prod/images/taco-spaghetti2-1671200124.jpg"
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

  // const data = ref(database, "hi");
  // get(data).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     console.log(snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });

  const items: Record<string, MenuItemInfo[]> = {
    food: [
      {
        name: "Pork in Black Bean Sauce",
        sides: "with Asian-style noodles, prawn crackers, and coleslaw",
        price: "5.70",
        dietaryRequirements: [],
        availability: 8,
        img: "dummy",
      },
      {
        name: "Roasted Corn Fed Chicken Breast",
        sides: "with Yorkshire pudding, roasted potatoes, and mixed vegetables",
        price: "5.70",
        dietaryRequirements: ["Halal"],
        availability: 8,
        img: "dummy",
      },
      {
        name: "Creamy Tomato Rigatoni",
        sides: "with garlic bread and rocket Parmesan salad",
        price: "5.70",
        dietaryRequirements: ["Vegetarian"],
        availability: 8,
        img: "dummy",
      },
    ],
    drinks: [
      {
        name: "San Pellegrino Lemonade",
        price: "1.02",
        availability: 8,
        img: "dummy",
      },
    ],
    desserts: [
      {
        name: "Apple & Peach Crumble Custard",
        price: "1.92",
        availability: 8,
        img: "dummy",
      },
    ],
  };

  return (
    <>
      <RestaurantHeader info={info} />
      <Tabs defaultValue={Object.keys(items)[0]}>
        <div className="flex items-center justify-center mb-4">
          <TabsList>
            {Object.keys(items).map((category) => (
              <TabsTrigger value={category}>{capitalise(category)}</TabsTrigger>
            ))}
          </TabsList>
        </div>
        {Object.entries(items).map(([category, items]) => (
          <TabsContent value={category} className="space-y-4 overflow-auto">
            {items.map((item) => (
              <MenuItemCard info={item} />
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Restaurant;
