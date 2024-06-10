import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  ref,
  set,
  push,
  remove,
  DatabaseReference,
  get,
} from "firebase/database";
import {
  getDownloadURL,
  ref as ref_storage,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "./shadcn/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./shadcn/Form";
import { Input } from "./shadcn/Input";
import { Label } from "./shadcn/Label";
import { LoadingSpinner } from "./shadcn/LoadingSpinner";
import { Textarea } from "./shadcn/Textarea";
import { ToggleGroup, ToggleGroupItem } from "./shadcn/ToggleGroup";

import { database, storage } from "../firebase";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  category: z.coerce.string(),
  duration: z.coerce.string(),
  price: z
    .union([
      z.string().transform((x) => x.replace(/[^0-9.-]+/g, "")),
      z.number(),
    ])
    .pipe(z.coerce.number().min(0.01).max(999)),
  initialQuantity: z.coerce.number().positive(),
  dietaryRequirements: z.array(z.string()),
  description: z.string().max(200),
  image: z.instanceof(File),
  // duration: z.string(),
});

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  initialQuantity: number;
  dietaryRequirements: string[];
  description: string;
  timestamp?: number;
}

interface MenuItemImage {
  item?: MenuItem;
  image?: string;
}

interface ItemFormProps {
  itemImage?: MenuItemImage;
  onSubmissionComplete?: () => void;
  resetAfterSubmission?: boolean;
}

function ItemInformationForm({
  itemImage,
  onSubmissionComplete,
  resetAfterSubmission,
}: ItemFormProps) {
  const [isSubmitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const item = itemImage?.item;
  const original_image = itemImage?.image;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: item
      ? item
      : {
          name: "",
          dietaryRequirements: [],
          description: "",
        },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    const {
      name,
      price,
      category,
      initialQuantity,
      dietaryRequirements,
      description,
      image,
      duration,
    } = values;

    const user = getAuth().currentUser;
    if (!user) {
      console.error("User not signed in!");
      return;
    }
    const uid = user.uid;
    get(ref(database, "Staff/" + uid)).then((snapshot) => {
      if (item) {
        ref(database, "Staff");
        const deleteItemRef = ref(
          database,
          `${snapshot.val()}/${item.category}/${item.id}`,
        );
        const newItemRef = ref(
          database,
          `${snapshot.val()}/${category}/${item.id}`,
        );
        const imageRef = ref_storage(
          storage,
          `${snapshot.val()}/Items/` + item.id,
        );

        remove(deleteItemRef).then(() => {
          addItem(newItemRef, imageRef);
        });
      } else {
        const itemsRef = ref(database, snapshot.val() + "/" + category);
        const newItemRef = push(itemsRef);
        const imageRef = ref_storage(
          storage,
          "SCR Restaurant/Items/" + newItemRef.key,
        );
        addItem(newItemRef, imageRef);
      }
    });

    function addItem(
      newItemRef: DatabaseReference,
      imageRef: StorageReference,
    ) {
      let newname = name;
      if (description) {
        newname += `with ${description}`;
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (image.name !== "Original Image") {
        uploadBytes(imageRef, image as File).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            set(newItemRef, {
              name: newname,
              price,
              quantity: initialQuantity,
              image: url,
              gf: dietaryRequirements?.includes("gluten-free"),
              nf: dietaryRequirements?.includes("nut-free"),
              v: dietaryRequirements?.includes("vegetarian"),
              vg: dietaryRequirements?.includes("vegan"),
              timestamp: duration === "Daily" ? Date.now() : null,
            }).then(() => {
              if (onSubmissionComplete) {
                onSubmissionComplete();
              }
              if (resetAfterSubmission) {
                form.reset();

                // Ideally we do not need to do the following but react-hook-form will not clear
                // the price and initialQuantity fields because we need to supply default values
                // but it is an absolute pain in the ass to make them nullable in zod and work well
                // with react-hook-form
                (
                  document.getElementById("item-info-form") as HTMLFormElement
                ).reset();
              }
              setSubmitting(false);
            });
          });
        });
      } else {
        set(newItemRef, {
          name: newname,
          price,
          quantity: initialQuantity,
          image: original_image,
          gf: dietaryRequirements?.includes("gluten-free"),
          nf: dietaryRequirements?.includes("nut-free"),
          v: dietaryRequirements?.includes("vegetarian"),
          vg: dietaryRequirements?.includes("vegan"),
          timestamp: duration === "Daily" ? Date.now() : null,
        }).then(() => {
          if (onSubmissionComplete) {
            onSubmissionComplete();
          }
          if (resetAfterSubmission) {
            form.reset();

            // Ideally we do not need to do the following but react-hook-form will not clear
            // the price and initialQuantity fields because we need to supply default values
            // but it is an absolute pain in the ass to make them nullable in zod and work well
            // with react-hook-form
            (
              document.getElementById("item-info-form") as HTMLFormElement
            ).reset();
          }
          setSubmitting(false);
        });
      }
    }
  }

  function onInvalid(errors: object) {
    console.error(errors);
  }

  useEffect(() => {
    if (original_image) {
      const tmp_file = document.getElementById(
        "image-input",
      ) as HTMLInputElement;
      const file = new File([""], "Original Image");
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const event = new Event("change", { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  }, []);

  return (
    <Form {...form}>
      <form
        id="item-info-form"
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input id="price-input" placeholder="£" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="initialQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial quantity</FormLabel>
              <FormControl>
                <Input id="initial-quantity-input" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>Category</Label>
          <ToggleGroup
            className="grid grid-cols-2 gap-1"
            type="single"
            defaultValue={item ? item.category : ""}
            onValueChange={(category) => {
              form.setValue("category", category);
            }}
          >
            <ToggleGroupItem value="Food" variant="outline">
              Food
            </ToggleGroupItem>
            <ToggleGroupItem value="Drink" variant="outline">
              Drink
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label>Duration</Label>
          <ToggleGroup
            className="grid grid-cols-2 gap-1"
            type="single"
            defaultValue={
              item && item.timestamp != undefined ? "Daily" : "Permanent"
            }
            onValueChange={(duration) => {
              form.setValue("duration", duration);
            }}
          >
            <ToggleGroupItem value="Permanent" variant="outline">
              Permanent
            </ToggleGroupItem>
            <ToggleGroupItem value="Daily" variant="outline">
              Daily
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="space-y-2">
          <Label>Dietary requirements</Label>
          <ToggleGroup
            className="grid grid-cols-2 gap-1"
            type="multiple"
            defaultValue={item ? item.dietaryRequirements : []}
            onValueChange={(dietaryRequirements) => {
              form.setValue("dietaryRequirements", dietaryRequirements);
            }}
          >
            <ToggleGroupItem value="vegetarian" variant="outline">
              Vegetarian
            </ToggleGroupItem>
            <ToggleGroupItem value="vegan" variant="outline">
              Vegan
            </ToggleGroupItem>
            <ToggleGroupItem value="gluten-free" variant="outline">
              Gluten-free
            </ToggleGroupItem>
            <ToggleGroupItem value="nut-free" variant="outline">
              Nut-free
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of menu item</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. sides"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Upload image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  id="image-input"
                  accept="image/x-png,image/jpeg,image/gif"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const image = e.target.files?.[0] || null;
                    if (image) {
                      form.setValue("image", image);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-center w-full mt-[20px]">
          {isSubmitting ? (
            <LoadingSpinner size={30} />
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Form>
  );
}

export { ItemInformationForm };
