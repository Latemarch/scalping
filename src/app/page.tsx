import Container from "@/candleChart/Container";
import OptionPanel from "./components/OptionPanel";

export default function Home() {
  return (
    <div className="flex w-full h-screen flex-col gap-4 p-4">
      <Container />
      <OptionPanel />
    </div>
  );
}
