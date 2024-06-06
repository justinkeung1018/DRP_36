import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconMapPinFilled } from "@tabler/icons-react";

import { AspectRatio } from "./shadcn/AspectRatio";
import { Badge } from "./shadcn/Badge";
import { Card, CardContent, CardHeader } from "./shadcn/Card";

import { RestaurantInfo } from "../types";

interface RestaurantCardProps {
  info: RestaurantInfo;
}

const RestaurantCard = ({ info }: RestaurantCardProps) => {
  const { name, waitTime, location, img } = info;

  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [nutFree, setNutFree] = useState(false);

  useEffect(() => {
    // TODO: Load dietary requirements and update state
  }, []);

  return (
    <Link
      to="/restaurant"
      state={{ info }}
      style={{ textDecoration: "none", color: "black" }}
    >
      <Card className="transition w-full border-none shadow-none hover:shadow-lg">
        <CardHeader className="p-2">
          <div className="w-full overflow-hidden">
            <AspectRatio ratio={20 / 9}>
              <img
                src={img}
                alt="Food"
                className="object-cover w-full h-full rounded-md"
              />
            </AspectRatio>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center gap-x-2">
                <h1 className="font-bold text-xl">{name}</h1>
                <div className="flex items-center gap-x-1">
                  {vegetarian && (
                    <Badge className="bg-green-700 px-1.5 py-0.25">V</Badge>
                  )}
                  {vegan && (
                    <Badge className="bg-lime-400 px-1.5 py-0.25">VG</Badge>
                  )}
                  {glutenFree && (
                    <Badge className="bg-sky-600 px-1.5 py-0.25">GF</Badge>
                  )}
                  {nutFree && (
                    <Badge className="bg-fuchsia-700 px-1.5 py-0.25">NF</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-x-1">
                <div className="flex items-center justify-center text-slate-400">
                  <div>
                    <IconMapPinFilled className="h-4 w-4" />
                  </div>
                </div>
                <p className="font-light">{location}</p>
              </div>
            </div>
            <div>
              <h2 className="font-medium text-xl text-right">
                {waitTime} mins
              </h2>
              <p className="font-light text-right">estimated wait</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
