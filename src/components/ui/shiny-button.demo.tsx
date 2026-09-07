import { ShinyButton } from "./shiny-button";

export default function DemoOne() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <ShinyButton onClick={() => console.log("Button clicked!")}>
        Get unlimited access
      </ShinyButton>
    </div>
  );
}
