import { Header } from "../../components/Header";
import { Items } from "./Items";

export function Archive() {
  return (
    <>
      <Items mode="archive" />
      <Header spritePath="./images/sprites/happy.png">
        Check out past items!
      </Header>
    </>
  );
}
