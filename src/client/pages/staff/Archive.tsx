import { Header } from "../../components/Header";
import { Items } from "./Items";

export function Archive() {
  return (
    <>
      <Header spritePath="./images/sprites/happy.png">
        Check out past items!
      </Header>
      <Items mode="archive" />
    </>
  );
}
