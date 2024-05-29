import { Dispatch, FormEvent, SetStateAction, useRef, useState } from "react";
import Nav from "../../components/Nav";
import { ref, set, push } from "firebase/database";
import { database, storage } from "../../firebase";
import {
  getDownloadURL,
  ref as ref_storage,
  uploadBytes,
} from "firebase/storage";

const Items = () => {
  return (
    <div>
      <Nav />
      <h1>ITEMS</h1>
      <ItemInformation />
    </div>
  );
};

export default Items;

const ItemInformation = () => {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (image == null || input1 === "" || input2 === "") {
      return;
    }
    setInput1("");
    setInput2("");
    setImage(null);
    const itemsRef = ref(database, "Kimiko/Items");
    const newItemRef = push(itemsRef);
    const imageRef = ref_storage(storage, "Kimiko/Items/" + newItemRef.key);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        set(newItemRef, { name: input1, quantity: input2, url: url });
      });
    });
  };

  return (
    <div>
      <input
        type="file"
        accept="image/x-png,image/jpeg,image/gif"
        ref={fileInputRef}
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name
            <input
              type="text"
              value={input1}
              onChange={(e) => setInput1(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Quantity
            <input
              type="text"
              value={input2}
              onChange={(e) => setInput2(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
