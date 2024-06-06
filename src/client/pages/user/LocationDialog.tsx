import { useEffect, useState } from "react";

import { Button } from "../../components/shadcn/Button";
import {
  Dialog,
  DialogContentWithoutX,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/shadcn/Dialog";
import { get, push, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { database } from "../../firebase";

function getDistanceFromLatLonInM(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d * 1000;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function LocationDialog() {
  const [open, setOpen] = useState(false);
  const [restaurant, setRestaurant] = useState("");
  const coords = { "SCR Restaurant": [51.4948061, -0.1861341] };

  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          Object.entries(coords).forEach(([name, [lat, long]]) => {
            const distance = getDistanceFromLatLonInM(
              position.coords.latitude,
              position.coords.longitude,
              lat,
              long,
            );
            if (distance < 30) {
              const user = getAuth().currentUser;
              if (!user) {
                console.error("User not signed in!");
                return;
              }
              const uid = user.uid;
              get(ref(database, `Users/${uid}/Queue`)).then((snapshot) => {
                if (!snapshot.exists()) {
                  setOpen(true);
                  setRestaurant(name);
                } else {
                  const lastAccepted = snapshot.val()?.lastAccepted ?? 0;
                  const lastRestaurantFailed =
                    snapshot.val()[name]?.lastRestaurantFailed ?? 0;
                  const time = Date.now();
                  if (
                    time - lastRestaurantFailed > 600000 &&
                    time - lastAccepted > 86400000
                  ) {
                    setOpen(true);
                    setRestaurant(name);
                  }
                }
              });
            }
          });
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true },
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  function handleQueueResponse(isQueueing: boolean) {
    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    if (isQueueing) {
      set(ref(database, `Users/${uid}/Queue/lastAccepted`), Date.now());
      const pushRef = push(ref(database, `Queue/${restaurant}`));
      set(pushRef, { time: Date.now() });
    } else {
      set(
        ref(database, `Users/${uid}/Queue/${restaurant}/lastRestaurantFailed`),
        Date.now(),
      );
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContentWithoutX className="flex flex-col items-center justify-center rounded-lg max-w-[70dvw] max-h-[70dvh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Are you queueing in {restaurant}?</DialogTitle>
          <DialogDescription>
            This information helps us predict queues more accurately for you.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-x-2 w-full">
          <Button
            className="flex-1 bg-red-600"
            onClick={() => handleQueueResponse(false)}
          >
            No
          </Button>
          <Button
            className="flex-1 bg-green-600"
            onClick={() => handleQueueResponse(true)}
          >
            Yes
          </Button>
        </div>
      </DialogContentWithoutX>
    </Dialog>
  );
}

export { LocationDialog };
