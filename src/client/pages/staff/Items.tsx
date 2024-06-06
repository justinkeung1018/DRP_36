import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { getAuth } from "firebase/auth";
import { IoAddOutline } from "react-icons/io5";

import { Button } from "../../components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/shadcn/Dialog";
import { Input } from "../../components/shadcn/Input";
import { Separator } from "../../components/shadcn/Separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/shadcn/Tabs";

import { MenuItemInfo } from "../../types";
import { ItemInformationForm } from "../../components/ItemInformationForm";
import { MenuItemCard } from "../../components/MenuItemCard";

interface StaffHeaderProps {
  restaurantName: string;
}

function StaffHeader({ restaurantName }: StaffHeaderProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4 mt-10">
        <h1 className="text-2xl font-bold">{restaurantName}</h1>
        <h2 className="text-lg font-light">Staff page</h2>
      </div>
      <Separator className="mb-2" />
      <h1 className="text-xl text-center font-bold mx-4 py-2">Menu</h1>
    </>
  );
}

// function StaffMenuItemCard({ info }: { info: MenuItemInfo }) {
//   const { gf, nf, image, name, price, quantity, v, vg } = info;
//   const [currentQuantity, setCurrentQuantity] = useState(quantity);
//   const { name: mainName, description } = parseMenuName(name);

//   let availabilityColour;
//   let status;
//   if (quantity > 50) {
//     availabilityColour = "border-green-700 text-green-700";
//     status = "high";
//   } else if (quantity > 20) {
//     availabilityColour = "border-amber-700 text-amber-700";
//     status = "medium";
//   } else if (quantity > -1000000) {
//     availabilityColour = "border-red-500 text-red-500";
//     status = "low";
//   } else {
//     availabilityColour = "border-red-700 text-red-700";
//     status = "sold out";
//   }

//   return (
//     <>
//       <Card className="px-4 border-none shadow-none">
//         <div className="basis-3/4 flex justify-between gap-x-2">
//           <div>
//             <CardHeader className="p-0 text-lg font-medium leading-tight">
//               {mainName}
//             </CardHeader>
//             <CardContent className="p-0">
//               <div className="flex items-center gap-x-1">
//                 <div className="text-gray-500 font-light">£{price}</div>
//                 {(v || vg || gf || nf) && <div>·</div>}
//                 {v && <Badge className="bg-green-700 px-1.5 py-0.25">V</Badge>}
//                 {vg && <Badge className="bg-lime-400 px-1.5 py-0.25">VG</Badge>}
//                 {gf && <Badge className="bg-sky-600 px-1.5 py-0.25">GF</Badge>}
//                 {nf && (
//                   <Badge className="bg-fuchsia-700 px-1.5 py-0.25">NF</Badge>
//                 )}
//               </div>

//               <div className="text-gray-500 font-light leading-tight">
//                 {description}
//               </div>
//               <Badge
//                 variant="outline"
//                 className={"mt-2 mx-0.5 " + availabilityColour}
//               >
//                 Availability: {status}
//               </Badge>
//             </CardContent>
//           </div>
//           <div className="basis-1/4 flex-none flex flex-col items-center justify-center">
//             <AspectRatio ratio={1}>
//               <img
//                 src={image}
//                 alt="Food"
//                 className="object-cover w-full h-full rounded-md"
//               />
//             </AspectRatio>
//           </div>
//         </div>
//       </Card>
//       <Separator className="ml-4 w-[calc(100%-4)]" />
//     </>
//   );
// }

export default function Items() {
  const [name, setName] = useState("SCR Restaurant");
  const user = getAuth().currentUser;
  if (!user) {
    console.error("User not signed in!");
    return;
  }
  const uid = user.uid;
  useEffect(() => {
    const unsubscribe = onValue(ref(database, "Staff/" + uid), (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        setName(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [items, setItems] = useState<
    Record<string, Record<string, MenuItemInfo>>
  >({});

  const [userInput, setUserInput] = useState("");

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
      <StaffHeader restaurantName={name} />
      <Input
        placeholder="Search For an Item"
        onChange={(e) => {
          setUserInput(e.target.value.toLowerCase().replace(/\s+/g, ""));
        }}
      />
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
                {Object.entries(items).map(
                  ([key, item]: [string, MenuItemInfo]) => {
                    if (
                      item.name
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .includes(userInput)
                    ) {
                      return (
                        <MenuItemCard
                          info={{ ...item, category, key, restaurant: name }}
                          isStaff
                        />
                      );
                    }
                  },
                )}
              </TabsContent>
            ))}
      </Tabs>
      <Dialog>
        <DialogTrigger>
          <Button
            variant="outline"
            className="fixed bottom-20 right-10 shadow-md font-bold h-fit"
          >
            <div className="flex flex-col items-center">
              <div>
                <IoAddOutline size={30} />
              </div>
              <div>Add item</div>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-lg max-w-[90dvw] max-h-[85dvh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Add food item</DialogTitle>
          </DialogHeader>
          <ItemInformationForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
