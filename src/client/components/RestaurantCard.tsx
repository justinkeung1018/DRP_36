import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconMapPinFilled } from "@tabler/icons-react";

import { AspectRatio } from "./shadcn/AspectRatio";
import { Badge } from "./shadcn/Badge";
import { Card, CardContent, CardHeader } from "./shadcn/Card";

import { MenuItemInfoNoKey, RestaurantInfo } from "../types";
import {
  get,
  limitToLast,
  onValue,
  orderByChild,
  orderByKey,
  query,
  ref,
  set,
  startAt,
} from "firebase/database";
import { database } from "../firebase";

interface RestaurantCardProps {
  info: RestaurantInfo;
}

const RestaurantCard = ({ info }: RestaurantCardProps) => {
  const { name, location, img } = info;
  const [waitTime, setWaitTime] = useState(0);
  const [waitTimes, setWaitTimes] = useState<
    Record<
      string,
      Record<string, { averageQueue: number; averageWait: number }>
    >
  >({});

  useEffect(() => {
    const unsubcribe = onValue(ref(database, "WaitTimes"), (snapshot) => {
      if (snapshot.exists()) {
        setWaitTimes(snapshot.val());
      }
    });

    return () => {
      unsubcribe();
    };
  }, []);

  useEffect(() => {
    const recentQuery = query(
      ref(database, `Queue/${name}`),
      orderByChild("time"),
      startAt(Date.now() - 300000),
    );
    const unsubcribe = onValue(recentQuery, (snapshot) => {
      if (snapshot.exists()) {
        const amount = Object.keys(snapshot.val() ?? {}).length;
        const hour = new Date().getHours();
        const { averageQueue, averageWait } = waitTimes[name][hour.toString()];
        setWaitTime(Math.round(averageWait * (amount / averageQueue)));
      }
    });

    return () => {
      unsubcribe();
    };
  }, [waitTimes]);

  const [vegetarian, setVegetarian] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [nutFree, setNutFree] = useState(false);

  useEffect(() => {
    const restaurantRef = ref(database, `${name}/Food`);
    get(restaurantRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data: Record<string, MenuItemInfoNoKey> = snapshot.val();
        let gf = false;
        let vegan = false;
        let vegetarian = false;
        let nf = false;
        Object.values(data).forEach((item: MenuItemInfoNoKey) => {
          gf = gf || item.gf;
          vegan = vegan || item.v;
          vegetarian = vegetarian || item.vg;
          nf = nf || item.nf;
        });
        setGlutenFree(gf);
        setVegan(vegan);
        setVegetarian(vegetarian);
        setNutFree(nf);
      }
    });
  }, []);

  return (
    <Card className="border-none shadow-none pt-4 md:w-1/2 md:border-solid md:shadow-sm md:pb-4 md:mb-8">
      <Link
        to="/restaurant"
        state={{ info }}
        style={{ textDecoration: "none", color: "black" }}
      >
        <CardHeader className="px-4 py-0 mb-2">
          <div className="w-full overflow-hidden">
            <AspectRatio ratio={20 / 9}>
              <div className="transition w-full h-full rounded-md opacity-0 hover:opacity-30 bg-black absolute md:hidden" />
              <img
                src={img}
                alt="Food"
                className="object-cover w-full h-full rounded-md"
              />
            </AspectRatio>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-0">
          <div>
            <div className="flex items-center gap-x-1 justify-between">
              <div className="flex items-center gap-x-2">
                <h1 className="font-bold text-lg">{name}</h1>
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
              <h2 className="font-medium text-lg text-right">
                {waitTime} mins
              </h2>
            </div>
            <div className="flex gap-x-1 items-center justify-between">
              <div className="flex gap-x-1 items-center">
                <div className="flex items-center justify-center text-slate-400">
                  <div>
                    <IconMapPinFilled className="h-4 w-4" />
                  </div>
                </div>
                <p className="font-light text-sm">{location}</p>
              </div>
              <p className="font-light text-right text-sm">estimated wait</p>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default RestaurantCard;
