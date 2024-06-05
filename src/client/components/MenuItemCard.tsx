import { useEffect, useState } from "react";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";

import { AspectRatio } from "./shadcn/AspectRatio";
import { Badge } from "./shadcn/Badge";
import { Card, CardContent, CardHeader } from "./shadcn/Card";
import { Separator } from "./shadcn/Separator";

import { MenuItemInfo } from "../types";
import {
  equalTo,
  get,
  increment,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { database } from "../firebase";
import { useLocation } from "react-router-dom";

function addFavourite(info: MenuItemInfo) {
  const user = getAuth().currentUser;
  if (!user) {
    console.error("User not signed in!");
    return;
  }
  const uid = user.uid;
  const favouritesRef = ref(database, `Users/${uid}/Favourites`);
  const favouritesListRef = push(favouritesRef);

  set(favouritesListRef, {
    key: info.key,
    category: info.category,
    restaurant: info.restaurant,
  })
    .then(() => {
      console.log("Favourite item added successfully.");
    })
    .catch((error) => {
      console.error("Error adding favourite item: ", error);
    });
}
function removeFavourite(info: MenuItemInfo) {
  const user = getAuth().currentUser;
  if (!user) {
    console.error("User not signed in!");
    return;
  }
  const uid = user.uid;
  const dbRef = ref(database, `Users/${uid}/Favourites`);

  const valueQuery = query(dbRef, orderByChild("key"), equalTo(info.key));

  get(valueQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const entryKey = Object.keys(snapshot.val())[0]; // Get the key of the single entry
        const entryRef = ref(database, `Users/${uid}/Favourites/${entryKey}`); // Reference to the specific entry

        // Perform the delete operation
        set(entryRef, null)
          .then(() => {
            console.log("Entry has been removed.");
          })
          .catch((error) => {
            console.error("Error removing entry: ", error);
          });
      } else {
        console.log("No entry found.");
      }
    })
    .catch((error) => {
      console.error("Error removing entry: ", error);
    });
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

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    const dbRef = ref(database, `Users/${uid}/Favourites`);

    const valueQuery = query(dbRef, orderByChild("key"), equalTo(info.key));
    get(valueQuery)
      .then((snapshot) => {
        setFavourite(snapshot.exists());
      })
      .catch((error) => {
        console.error("Error checking favourite item: ", error);
      });
  }, [info.key]);

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
  const location = useLocation();
  if (location.state) {
    info.restaurant = location.state.info.name;
  }

  let availabilityColour;
  if (true) {
    availabilityColour = "border-green-700 text-green-700";
  } else if (quantity > 10) {
    availabilityColour = "border-amber-700 text-amber-700";
  } else {
    availabilityColour = "border-red-700 text-red-700";
  }

  const buyItem = () => {
    const dbRef = ref(
      database,
      `${info.restaurant}/${info.category}/${info.key}`,
    );
    update(dbRef, {
      quantity: increment(-1),
    });
  };

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
              <Badge
                variant="outline"
                className={"mt-2 mx-0.5 " + availabilityColour}
              >
                Availability: {quantity}
              </Badge>
              {quantity > -1000000 ? (
                <Badge
                  variant="outline"
                  className={"mt-2 mx-0.5 cursor-pointer bg-red-500"}
                  onClick={buyItem}
                >
                  Buy
                </Badge>
              ) : (
                <></>
              )}
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

export { MenuItemCard, parseMenuName };
