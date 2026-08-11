import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { GameCanvas } from "@/components/game/GameCanvas";
import { MetacognitionScreen } from "@/components/game/MetacognitionScreen";
import { flow } from "@/data/flow";

export const Route = createFileRoute("/metatest")({
  component: MetaTest,
});

function MetaTest() {
  const metas = flow.filter((s) => s.kind === "meta");
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const step = metas[i]!;
  if (step.kind !== "meta") return null;
  return (
    <GameCanvas background="reflection">
      <MetacognitionScreen
        meta={step.meta}
        answered={answered}
        wrong={false}
        speech={answered ? step.meta.correct : step.meta.question}
        speaking={false}
        finished={false}
        onAnswer={() => setAnswered(true)}
        onPlay={() => {}}
        onNext={() => {
          setAnswered(false);
          setI((v) => (v + 1) % metas.length);
        }}
      />
    </GameCanvas>
  );
}
