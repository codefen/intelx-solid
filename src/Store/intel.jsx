import { createSignal, createRoot } from "solid-js";

function createIntel() {
  const [intelData, setIntelData] = createSignal(localStorage.getItem('intelData') ? JSON.parse(localStorage.getItem('intelData')) : []);
  const [intelHistory, setIntelHistory] = createSignal(localStorage.getItem('intelHistory') ? JSON.parse(localStorage.getItem('intelHistory')) : []);
  return { intelData, setIntelData, intelHistory, setIntelHistory };
}

export default createRoot(createIntel);