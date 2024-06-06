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

export default function Items() {
  const [name, setName] = useState("SCR Restaurant");
  const [open, setOpen] = useState(false); // To control the add item form
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
      <Dialog open={open} onOpenChange={setOpen}>
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
          <ItemInformationForm resetAfterSubmission />
        </DialogContent>
      </Dialog>
    </>
  );
}
