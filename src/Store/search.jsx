import { createSignal, createRoot } from "solid-js";

function createSearch() {
  const [searchStore, setSearchStore] = createSignal(null);
  return { searchStore, setSearchStore };
}

export default createRoot(createSearch);