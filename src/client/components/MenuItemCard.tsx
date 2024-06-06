import { useEffect, useState } from "react";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import {
  equalTo,
  get,
  increment,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import { database } from "../firebase";
import { useLocation } from "react-router-dom";
import { Timestamp } from "firebase/firestore";

import { AspectRatio } from "./shadcn/AspectRatio";
import { Badge } from "./shadcn/Badge";
import { Button } from "./shadcn/Button";
import { Card, CardContent, CardHeader } from "./shadcn/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./shadcn/Dialog";
import { Separator } from "./shadcn/Separator";

import { MenuItemInfo } from "../types";
import { ItemInformationForm } from "./ItemInformationForm";

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

interface MenuItemCardProps {
  info: MenuItemInfo;
  isStaff?: boolean;
  withSeparator?: boolean;
}

function MenuItemCard({
  info,
  isStaff,
  withSeparator = true,
}: MenuItemCardProps) {
  const {
    gf,
    nf,
    image,
    name,
    price,
    quantity,
    v,
    vg,
    restaurant,
    category,
    key,
    timestamp,
  } = info;
  const { name: mainName, description } = parseMenuName(name);
  const location = useLocation();
  if (location.state) {
    info.restaurant = location.state.info.name;
  }

  const [open, setOpen] = useState(false); // To control the edit item dialog

  let availabilityColour;
  let status;
  if (quantity >= 50) {
    availabilityColour = "border-green-700 text-green-700";
    status = "high";
  } else if (quantity >= 20) {
    availabilityColour = "border-amber-700 text-amber-700";
    status = "medium";
  } else if (quantity > -1000000) {
    availabilityColour = "border-red-500 text-red-500";
    status = "low";
  } else {
    availabilityColour = "border-red-700 text-red-700";
    status = "sold out";
  }

  const [currentQuantity, setCurrentQuantity] = useState(quantity);

  function buyItem() {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    const userRef = ref(database, `Users/${uid}/Recents`);

    let init = true;

    onValue(userRef, (snapshot) => {
      if (init) {
        init = false;
        if (snapshot.val() === null) {
          set(userRef, {
            item1: Timestamp.fromDate(new Date("1970-01-01")),
            item2: Timestamp.fromDate(new Date("1970-01-01")),
            item3: Timestamp.fromDate(new Date("1970-01-01")),
            item4: Timestamp.fromDate(new Date("1970-01-01")),
            item5: Timestamp.fromDate(new Date("1970-01-01")),
          })
            .then((val) => {
              replaceItem("item1");
            })
            .catch((error) => {
              console.error("List init failed: ", error);
            });
        } else {
          let itemToChange = null;

          snapshot.forEach((child) => {
            const date = new Date();
            let timePassed =
              date.getTime() -
              (child.val().seconds * 1000 + child.val().nanoseconds / 1000000);
            if (timePassed > 1800000) {
              itemToChange = child.key;
            }
          });

          replaceItem(itemToChange);
        }
      }
    });

    function replaceItem(itemToChange: string | null) {
      if (itemToChange) {
        alert("successfully bought item");
        let updates: { [key: string]: Timestamp } = {};
        updates[itemToChange] = Timestamp.fromDate(new Date());
        update(userRef, updates).then(() => {
          const dbRef = ref(database, `${restaurant}/${category}/${key}`);
          update(dbRef, {
            quantity: increment(-1),
          });
        });
      } else {
        alert("Limit reached. You can only buy 5 items in 30 mins");
      }
    }
  }

  function deleteItem() {
    const dbRef = ref(database, `${restaurant}/${category}/${key}`);
    remove(dbRef).then(() => alert(`Deleted ${parseMenuName(name).name}`));
  }

  function soldOut() {
    const dbRef = ref(database, `${restaurant}/${category}/${key}/quantity`);
    set(dbRef, -1000000).then(() => {
      alert(`${parseMenuName(name).name} is sold out`);
      setCurrentQuantity(-1000000);
    });
  }

  function getItem() {
    let dietaryRequirements = [];

    if (v) {
      dietaryRequirements.push("vegetarian");
    }

    if (vg) {
      dietaryRequirements.push("vegan");
    }

    if (nf) {
      dietaryRequirements.push("nut-free");
    }

    if (gf) {
      dietaryRequirements.push("gluten-free");
    }

    // let img = ref_storage(
    //   storage,
    //   "SCR Restaurant/Items/" + id,
    // );

    // getBlob(img).then((file) => {
    //   return {id,
    //     name,
    //     price,
    //     category,
    //     initialQuantity:quantity,
    //     dietaryRequirements,
    //     description,
    //     image: new File([file], "malhar")}
    // });

    const description = parseMenuName(name).description.split("with")[1]
      ? parseMenuName(name).description.split("with")[1].trimStart()
      : parseMenuName(name).description;

    return {
      id: key,
      name: parseMenuName(name).name,
      price,
      category: category,
      initialQuantity: quantity <= 0 ? 0 : quantity,
      dietaryRequirements,
      description,
      timestamp,
    };
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
              <Badge
                variant="outline"
                className={"mt-2 mx-0.5 " + availabilityColour}
              >
                Availability: {status}
              </Badge>
              {!isStaff && quantity > -1000000 && (
                <Badge
                  variant="outline"
                  className={"mt-2 mx-0.5 cursor-pointer bg-red-500"}
                  onClick={buyItem}
                >
                  Buy
                </Badge>
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
        {isStaff && (
          <div className="flex items-center justify-center gap-x-2 mt-2">
            <Button
              variant="outline"
              className="px-4 rounded-full drop-shadow"
              onClick={soldOut}
              disabled={currentQuantity <= -1000000}
            >
              Sold Out
            </Button>
            <Button
              variant="outline"
              className="px-4 rounded-full drop-shadow"
              onClick={deleteItem}
            >
              Delete
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button
                  variant="outline"
                  className="px-4 rounded-full drop-shadow"
                >
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg max-w-[90dvw] max-h-[85dvh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Edit food item</DialogTitle>
                </DialogHeader>
                <ItemInformationForm
                  item={getItem()}
                  onSubmissionComplete={() => {
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </Card>
      {withSeparator && <Separator className="ml-4 w-[calc(100%-4)]" />}
    </>
  );
}

export { MenuItemCard };
