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

import { MenuItemInfo, MenuItemInfoNoKey } from "../types";
import { ItemInformationForm } from "./ItemInformationForm";

import { AnimatePresence, useAnimate } from "framer-motion";

function addFavourite(info: MenuItemInfo) {
  const user = getAuth().currentUser;
  if (!user) {
    console.error("User not signed in!");
    return;
  }
  const uid = user.uid;
  const favouritesRef = ref(database, `Users/${uid}/Favourites`);
  const favouritesListRef = push(favouritesRef);
  const itemRef = ref(
    database,
    `${info.restaurant}/${info.category}/${info.key}`,
  );

  set(favouritesListRef, {
    key: info.key,
    category: info.category,
    restaurant: info.restaurant,
  })
    .then(() => {
      update(itemRef, { likes: increment(1) })
        .then(() => {
          console.log("Favourite item added successfully.");
        })
        .catch((err) => {
          console.error("Error adding favourite item: ", err);
        });
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
        const itemRef = ref(
          database,
          `${info.restaurant}/${info.category}/${info.key}`,
        );

        // Perform the delete operation
        set(entryRef, null)
          .then(() => {
            update(itemRef, { likes: increment(-1) })
              .then(() => {
                console.log("Item has been removed.");
              })
              .catch((err) => {
                console.error("Error removing entry: ", err);
              });
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
  const [scope, animate] = useAnimate();

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

  return (
    <AnimatePresence>
      <div ref={scope}>
        {favourite ? (
          <IoHeartSharp
            size={size}
            color="red"
            onClick={() => {
              setFavourite(false);
              removeFavourite(info);
            }}
          />
        ) : (
          <IoHeartOutline
            size={size}
            onClick={() => {
              animate(
                scope.current,
                { scale: [5, 1] },
                { type: "spring", stiffness: 400, damping: 17 },
              );
              setFavourite(true);
              addFavourite(info);
            }}
          />
        )}
      </div>
    </AnimatePresence>
  );
}

interface MenuItemCardProps {
  info: MenuItemInfo;
  mode?: "user" | "staff" | "archive";
  withSeparator?: boolean;
}

function MenuItemCard({
  info,
  mode = "user",
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
    status = "Plenty";
  } else if (quantity >= 20) {
    availabilityColour = "border-amber-700 text-amber-700";
    status = "Some";
  } else if (quantity > -1000000) {
    availabilityColour = "border-red-500 text-red-500";
    status = "Few";
  } else {
    availabilityColour = "border-red-700 text-red-700";
    status = "Sold out";
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
        alert("Successfully bought item.");
        let updates: { [key: string]: Timestamp } = {};
        updates[itemToChange] = Timestamp.fromDate(new Date());
        update(userRef, updates).then(() => {
          const dbRef = ref(database, `${restaurant}/${category}/${key}`);
          update(dbRef, {
            quantity: increment(-1),
          });
        });
      } else {
        alert("Limit reached. You can only buy 5 items in 30 mins.");
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
      item: {
        id: key,
        name: parseMenuName(name).name,
        price,
        category: category,
        initialQuantity: quantity <= 0 ? 0 : quantity,
        dietaryRequirements,
        description,
        timestamp,
      },
      image,
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
                  {mode !== "archive" && (
                    <Badge variant="outline" className={availabilityColour}>
                      {status}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-gray-500 font-light leading-tight">
                {description}
              </div>
              {mode === "user" && (
                <div className="flex items-center justify-left gap-x-2 mt-2">
                  <Button
                    variant="outline"
                    className="rounded-full drop-shadow disabled:drop-shadow-none w-2/3"
                    size="sm"
                    onClick={buyItem}
                    disabled={quantity <= -1000000}
                  >
                    {quantity > -1000000 ? "I bought this item" : "Sold out"}
                  </Button>
                  <FavouriteIcon size={20} info={info} />
                </div>
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
        {mode === "staff" && (
          <div className="flex items-center justify-center gap-x-2 mt-2">
            <Button
              variant="outline"
              className="px-4 rounded-full drop-shadow disabled:drop-shadow-none"
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
                  itemImage={getItem()}
                  onSubmissionComplete={() => {
                    setOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
        {mode === "archive" && (
          <div className="flex items-center justify-center mt-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button
                  variant="outline"
                  className="px-4 rounded-full drop-shadow"
                >
                  Add item
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-lg max-w-[90dvw] max-h-[85dvh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Add food item</DialogTitle>
                </DialogHeader>
                <ItemInformationForm
                  itemImage={getItem()}
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

function getRelevantMenuItemCards(
  items: Record<string, MenuItemInfoNoKey>,
  userInput: string,
  category: string,
  restaurant: string,
  mode: "user" | "staff" | "archive",
) {
  const relevantMenuItems = Object.entries(items).filter(([_, item]) =>
    item.name.toLowerCase().replace(/\s+/g, "").includes(userInput),
  );

  if (relevantMenuItems.length === 0) {
    return <h1 className="text-center font-normal text-lg">No items</h1>;
  }

  return relevantMenuItems.map(([key, item]) => {
    if (item.name.toLowerCase().replace(/\s+/g, "").includes(userInput)) {
      return (
        <MenuItemCard
          info={{ ...item, category, key, restaurant }}
          mode={mode}
        />
      );
    }
  });
}

export { MenuItemCard, getRelevantMenuItemCards };
