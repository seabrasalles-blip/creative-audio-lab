import { environment } from "@/data/assets";

/** Elementos decorativos do cenário, apenas com os assets fornecidos. */
export function SceneDecor() {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
      <img
        src={environment.coral}
        alt=""
        className="absolute bottom-0 left-0 h-auto w-[190px] object-contain"
      />
      <img
        src={environment.seaweed}
        alt=""
        className="absolute bottom-0 left-[188px] h-auto w-[110px] object-contain"
      />
      <img
        src={environment.rocks}
        alt=""
        className="absolute bottom-0 right-[196px] h-auto w-[150px] object-contain"
      />
      <img
        src={environment.shell}
        alt=""
        className="absolute bottom-2 left-[330px] h-auto w-[74px] object-contain"
      />
      <img
        src={environment.cave}
        alt=""
        className="absolute bottom-0 right-0 h-auto w-[210px] object-contain"
      />
    </div>
  );
}
