import { createFileRoute } from "@tanstack/react-router";

import { GameScreen } from "@/components/game/GameScreen";

const title = "Mara e as Subtrações no Recife de Corais";
const description =
  "Atividade interativa de Matemática (EF01MA08) para crianças de 6 a 8 anos: observe o recife e descubra quantos animais ficam quando alguns saem.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <GameScreen />;
}
