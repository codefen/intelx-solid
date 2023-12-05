import { TbLoader, TbLoader3 } from "solid-icons/tb";

function Loader() {
  return (
    <div
      class={`w-screen h-screen  flex items-center justify-center bg-black/10`}
    >
      <TbLoader class="w-14 h-14 codefend-text-red animate-spin" />
    </div>
  );
}

export default Loader;

export function PageLoader() {
  return (
    <div
      class={`w-full h-full flex items-center justify-center bg-transparent`}
    >
      <TbLoader3 class="w-10 h-10 codefend-text-red animate-spin" />
    </div>
  );
}
