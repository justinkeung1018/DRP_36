import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../../firebase";
import { getAuth } from "firebase/auth";
import { IoAddOutline } from "react-icons/io5";
import { Search } from "lucide-react";

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
import { getRelevantMenuItemCards } from "../../components/MenuItemCard";

interface StaffHeaderProps {
  restaurantName: string;
  mode: "staff" | "archive";
}

function StaffHeader({ restaurantName, mode }: StaffHeaderProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4 mt-10">
        <h1 className="text-2xl font-bold">{restaurantName}</h1>
        <h2 className="text-lg font-light">Staff page</h2>
      </div>
      <Separator className="mb-2" />
      <h1 className="text-xl text-center font-bold mx-4 py-2">
        {mode === "staff" ? "Today's menu" : "Past items"}
      </h1>
    </>
  );
}

interface ItemsProps {
  mode: "staff" | "archive";
}

export function Items({ mode }: ItemsProps) {
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

  const [expiryTimeSeconds, setExpiryTimeSeconds] = useState(86400);

  useEffect(() => {
    const unsubcribe = onValue(
      ref(database, "expiryTimeSeconds"),
      (snapshot) => {
        if (snapshot.exists()) {
          setExpiryTimeSeconds(snapshot.val());
        }
      },
    );
    return () => unsubcribe();
  }, []);

  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const restaurantRef = ref(database, name);
    const unsubscribe = onValue(restaurantRef, (snapshot) => {
      const data = snapshot.val();
      if (data != null) {
        for (const category in data) {
          for (const item in data[category]) {
            if (
              (mode === "staff" &&
                Date.now() - expiryTimeSeconds * 1000 >
                  data[category][item].timestamp) ||
              (mode === "archive" &&
                (data[category][item].timestamp === undefined ||
                  Date.now() - expiryTimeSeconds * 1000 <=
                    data[category][item].timestamp))
            ) {
              delete data[category][item];
            }
          }
        }
        setItems(data);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [name, mode, expiryTimeSeconds]);

  return (
    <div className="main-content">
      <StaffHeader restaurantName={name} mode={mode} />
      <Tabs defaultValue="Food">
        <div className="flex items-center justify-center mb-2">
          <TabsList>
            {["Food", "Drink"].map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="px-4 mb-4">
          <Input
            placeholder="Search for an item"
            startIcon={Search}
            onChange={(e) => {
              setUserInput(e.target.value.toLowerCase().replace(/\s+/g, ""));
            }}
          />
        </div>
        {Object.keys(items).length === 0
          ? ["Food", "Drink"].map((category) => (
              <TabsContent
                key={category}
                value={category}
                className="space-y-4 overflow-auto text-center font-normal text-lg"
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
                {getRelevantMenuItemCards(
                  items,
                  userInput,
                  category,
                  name,
                  mode,
                )}
                <div className="h-10" />
              </TabsContent>
            ))}
      </Tabs>
      {mode === "staff" && (
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
            <ItemInformationForm resetAfterSubmission />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
