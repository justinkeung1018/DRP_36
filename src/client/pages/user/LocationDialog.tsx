import { useEffect, useState } from "react";

import { Button } from "../../components/shadcn/Button";
import {
  Dialog,
  DialogContentWithoutX,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/shadcn/Dialog";

function LocationDialog() {
  const [open, setOpen] = useState(false);
  const [restaurant, setRestaurant] = useState("");

  useEffect(() => {
    // TOOD: set restaurant and open dialog whenever location is close enough to a restaurant
  }, []);

  function handleQueueResponse(isQueueing: boolean) {
    // TODO: update things
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
