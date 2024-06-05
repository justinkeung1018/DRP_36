import { useState } from "react";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

import { AspectRatio } from "./shadcn/AspectRatio";
import { Badge } from "./shadcn/Badge";
import { Card, CardContent, CardHeader } from "./shadcn/Card";
import { Separator } from "./shadcn/Separator";

import { MenuItemInfo } from "../types";

function addFavourite(info: MenuItemInfo) {
  // TODO: Add menu item to database
  console.log("Favourite added!");
}

function removeFavourite(info: MenuItemInfo) {
  // TODO: Remove menu item from database
  console.log("Favourite removed!");
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

interface FavouriteIconProps {
  info: MenuItemInfo;
  size?: number;
}

function FavouriteIcon({ size, info }: FavouriteIconProps) {
  const [favourite, setFavourite] = useState(false);

  return favourite ? (
    <IoHeartSharp
      size={size}
      onClick={() => {
        setFavourite(false);
        removeFavourite(info);
      }}
    />
  ) : (
    <IoHeartOutline
      size={size}
      onClick={() => {
        setFavourite(true);
        addFavourite(info);
      }}
    />
  );
}

function MenuItemCard({ info }: { info: MenuItemInfo }) {
  const { gf, nf, image, name, price, quantity, v, vg } = info;
  const { name: mainName, description } = parseMenuName(name);

  let availabilityColour;
  if (true) {
    availabilityColour = "border-green-700 text-green-700";
  } else if (quantity > 10) {
    availabilityColour = "border-amber-700 text-amber-700";
  } else {
    availabilityColour = "border-red-700 text-red-700";
  }

  return (
    <>
      <Card className="px-4 border-none shadow-none">
        <div className="flex items-center justify-between gap-x-2">
          <div className="basis-3/4">
            <CardHeader className="p-0 text-lg font-medium leading-tight w-full">
              {mainName}
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex items-center justify-between grow">
                <div className="flex items-center gap-x-1 w-full">
                  <div className="text-gray-500 font-light">£{price}</div>
                  {(v || vg || gf || nf) && <div>·</div>}
                  {v && (
                    <Badge className="bg-green-700 px-1.5 py-0.25">V</Badge>
                  )}
                  {vg && (
                    <Badge className="bg-lime-400 px-1.5 py-0.25">VG</Badge>
                  )}
                  {gf && (
                    <Badge className="bg-sky-600 px-1.5 py-0.25">GF</Badge>
                  )}
                  {nf && (
                    <Badge className="bg-fuchsia-700 px-1.5 py-0.25">NF</Badge>
                  )}
                </div>
                <FavouriteIcon size={20} info={info} />
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

export { MenuItemCard };