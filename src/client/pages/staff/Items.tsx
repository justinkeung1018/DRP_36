import { useEffect, useRef, useState } from "react";
import { onValue, ref, set, push } from "firebase/database";
import { database, storage } from "../../firebase";
import {
  getDownloadURL,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";
import { IoAddOutline } from "react-icons/io5";

import { Button } from "../../components/shadcn/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/shadcn/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/shadcn/Form";
import { Input } from "../../components/shadcn/Input";
import { Label } from "../../components/shadcn/Label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/shadcn/Tabs";
import { Textarea } from "../../components/shadcn/Textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../components/shadcn/ToggleGroup";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MenuItemCard } from "../description/Restaurant";
import { MenuItemInfo } from "../../types";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  category: z.string(),
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
});

function ItemInformationForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dietaryRequirements: [],
      description: "",
    },
  });
  const { formState, resetField } = form;

  // We use useEffect as recommended here: https://react-hook-form.com/docs/useform/reset
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      form.reset();
      // Ideally we do not need to do the following but react-hook-form will not clear
      // the price and initialQuantity fields because we need to supply default values
      // but it is an absolute pain in the ass to make them nullable in zod and work well
      // with react-hook-form
      (document.getElementById("item-info-form") as HTMLFormElement).reset();
    }
  }, [formState]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      name,
      price,
      category,
      initialQuantity,
      dietaryRequirements,
      description,
      image,
    } = values;
    console.log(values);
    const itemsRef = ref(database, "SCR Restaurant/" + category);
    const newItemRef = push(itemsRef);
    const imageRef = ref_storage(
      storage,
      "SCR Restaurant/Items/" + newItemRef.key,
    );
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    uploadBytes(imageRef, image as File).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        set(newItemRef, {
          name,
          price,
          quantity: initialQuantity,
          image: url,
          gf: dietaryRequirements?.includes("gluten-free"),
          nf: dietaryRequirements?.includes("nut-free"),
          v: dietaryRequirements?.includes("vegetarian"),
          vg: dietaryRequirements?.includes("vegan"),
        });
      });
    });
  }

  function onInvalid(errors: object) {
    console.error(errors);
  }

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
          <Label>Dietary requirements</Label>
          <ToggleGroup
            className="grid grid-cols-2 gap-1"
            type="multiple"
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
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

export default function Items() {
  const name = "SCR Restaurant";

  const [items, setItems] = useState<
    Record<string, Record<string, MenuItemInfo>>
  >({});

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
                {Object.values(items).map((item: MenuItemInfo) => (
                  <MenuItemCard info={item} />
                ))}
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
