import { getAuth, signOut } from "firebase/auth";

import { Badge } from "../../components/shadcn/Badge";
import { Button } from "../../components/shadcn/Button";
import { Separator } from "../../components/shadcn/Separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../components/shadcn/ToggleGroup";
import { database } from "../../firebase";
import { get, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";

function signOutOfAccount() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("Signed out");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}

// trivial change to force deploy

interface AccountHeaderProps {
  name: string;
}

function AccountHeader({ name }: AccountHeaderProps) {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-4 mt-10">
        <h1 className="text-2xl font-bold">Welcome back,</h1>
        <h2 className="text-lg font-light">
          {name === "Jamal" ? "Staff" : name}
        </h2>
      </div>
      <Separator className="mb-8" />
    </>
  );
}

function setDietaryRequirements(dietaryRequirements: string[]) {
  console.log("Dietar, ", dietaryRequirements);
  const user = getAuth().currentUser;
  if (!user) {
    console.error("User not signed in!");
    return;
  }
  const uid = user.uid;
  const favouritesRef = ref(database, `Users/${uid}/Dietary`);
  set(favouritesRef, {
    gf: dietaryRequirements.includes("gluten-free"),
    nf: dietaryRequirements.includes("nut-free"),
    v: dietaryRequirements.includes("vegetarian"),
    vg: dietaryRequirements.includes("vegan"),
  });
}

function DietaryRequirements() {
  const [dietary, setDietary] = useState<string[]>([]);
  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    const dietaryRef = ref(database, `Users/${uid}/Dietary`);
    get(dietaryRef)
      .then((snapshot) => {
        const data = snapshot.val();
        const newDietary = [];
        if (data["gf"]) {
          newDietary.push("gluten-free");
        }
        if (data["nf"]) {
          newDietary.push("nut-free");
        }
        if (data["v"]) {
          newDietary.push("vegetarian");
        }
        if (data["vg"]) {
          newDietary.push("vegan");
        }
        setDietary(newDietary);
      })
      .catch((error) => {
        console.error("Error getting dietary requirements:", error);
      });
  }, []);
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
        Dietary requirements
      </h1>
      <p className="text-sm text-muted-foreground mb-4">
        Only display menu items satisfying your dietary needs.
      </p>
      <ToggleGroup
        className="grid grid-cols-2 gap-1"
        type="multiple"
        value={dietary}
        onValueChange={(value) => {
          setDietary(value);
          setDietaryRequirements(value);
        }}
      >
        <ToggleGroupItem
          value="vegetarian"
          variant="outline"
          className="gap-x-2"
        >
          Vegetarian
          <Badge className="bg-green-700 px-1.5 py-0.25">V</Badge>
        </ToggleGroupItem>
        <ToggleGroupItem value="vegan" variant="outline" className="gap-x-2">
          Vegan
          <Badge className="bg-lime-400 px-1.5 py-0.25">VG</Badge>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="gluten-free"
          variant="outline"
          className="gap-x-2"
        >
          Gluten-free
          <Badge className="bg-sky-600 px-1.5 py-0.25">GF</Badge>
        </ToggleGroupItem>
        <ToggleGroupItem value="nut-free" variant="outline" className="gap-x-2">
          Nut-free
          <Badge className="bg-fuchsia-700 px-1.5 py-0.25">NF</Badge>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

const Account = () => {
  const user = getAuth().currentUser;
  let staff = false;

  if (user) {
    onValue(ref(database, `Staff/${user.uid}`), (snapshot) => {
      if (snapshot.exists()) {
        staff = true;
      }
    });
  }

  return (
    <>
      <AccountHeader name={getAuth().currentUser?.displayName || ""} />
      <div className="px-10">
        {staff ? <></> : <DietaryRequirements />}
        <div className="flex items-center justify-center">
          <Button onClick={signOutOfAccount}>Sign Out</Button>
        </div>
      </div>
    </>
  );
};

export default Account;
