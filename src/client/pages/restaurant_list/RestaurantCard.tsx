import { Link } from "react-router-dom";
import { IconMapPinFilled } from "@tabler/icons-react";

import { AspectRatio } from "../../components/shadcn/AspectRatio";
import { Card, CardContent, CardHeader } from "../../components/shadcn/Card";

import { RestaurantInfo } from "../../types";

const RestaurantCard = ({ info }: { info: RestaurantInfo }) => {
  const { name, waitTime, location, img } = info;

  return (
    <Link
      to="/restaurant"
      state={{ info }}
      style={{ textDecoration: "none", color: "black" }}
    >
      <Card className="w-full border-none">
        <CardHeader>
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
        <CardContent>
          <div className="flex justify-between">
            <div>
              <h1 className="font-bold text-xl">{name}</h1>
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
