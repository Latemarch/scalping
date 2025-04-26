import Container from "@/candleChart/Container";
import OptionPanel from "./components/OptionPanel";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Container />
      <OptionPanel />
    </div>
  );
}
