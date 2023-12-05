//Core packages
import { createSignal, createEffect, Show, For } from "solid-js";
import createSeach from "../../../Store/search.jsx";
import ApiHandler from "../../../Services/apiHandler.jsx";
import { makeIntersectionObserver } from "@solid-primitives/intersection-observer";
import createIntel from "../../../Store/intel.jsx";

function InxSearchAndData() {
  const [selectedResult, setSelectedResult] = createSignal(null);
  const [intelId, setIntelId] = createSignal([]);
  const { intelData, setIntelData } = createIntel;
  const { intelHistory, setIntelHistory } = createIntel;
  const [intelPreview, setIntelPreview] = createSignal(localStorage.getItem('intelDataPreview') ? JSON.parse(localStorage.getItem('intelDataPreview')) : []);
  const [loading, setLoading] = createSignal(true);
  const [offset, setOffset] = createSignal(0);
  const [count, setCount] = createSignal(0);

  console.log(intelData())
  
  const { searchStore, setSearchStore } = createSeach;
  
  createEffect(() => {
    if (searchStore() && searchStore() != '') {
      procSearch()
    }
  }, [searchStore()]);

  function filterAndHighlightLinesWithUrl(inputText, urlToFilter) {
    console.log(inputText);
    const lines = inputText.split("\n");
    const filteredLines = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(urlToFilter)) {
        for (let j = i - 3; j < i; j++) {
          if (j >= 0) {
            filteredLines.push(lines[j] + "<br>");
          }
        }
        filteredLines.push(`<b>${line}</b><br>`);
        for (let j = i + 1; j <= i + 3; j++) {
          if (j < lines.length) {
            filteredLines.push(lines[j] + "<br>");
          }
        }
        filteredLines.push(
          `<hr class="w-24 h-1 bg-gray-100 border-0 rounded md:my-2 dark:bg-white">`
        );
      }
    }
    return filteredLines.join("\n");
  }

  const procSearch = async () => {
    setIntelData([]);
    setOffset(0);
    try {
      const res = await ApiHandler.initializeIntelData({
        main: searchStore(),
      });
      let intHistory = intelHistory();
      intHistory.push({
        term: searchStore(),
        date: Date.now()
      })
      localStorage.setItem('intelHistory', JSON.stringify(intHistory));
      setIntelHistory(intHistory)
      setIntelId(res.id);
      console.log(intelId())
      //setCount(res.count);
      return procIntelSearch();
    } catch (err) {
      console.log(err);
    }
  };

  const { add: intersectionObserver } = makeIntersectionObserver(
    [],
    (entries) => {
      entries.forEach((e) => procMoreResults(e));
    }
  );

  const procIntelSearch = () => {
    setLoading(true);
    return ApiHandler.findIntelData({
      id: intelId(),
      offset: offset(),
    })
      .then((res) => {
        const intelResult = res.map((intel) => {
          intel.preview = "";
          return intel;
        });
        const intelProc = intelData().concat(intelResult);
        setIntelData(intelProc);
        setOffset(offset() + intelResult.length);
        processAllIntelData(intelResult);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const procMoreResults = () => {
    if (!loading()) {
      return procIntelSearch();
    }
  };
  const processPreview = (intel) => {
    return ApiHandler.findIntelPreview({
      sid: intel.storage_id,
      bid: intel.bucket_id,
      mid: intel.media_id,
    }).then((res) => {
      if (!res) return;
      const intelPreviewData = intelPreview();
      intelPreviewData.push({
        id: intel.storage_id,
        preview: res,
      });
      setIntelPreview(intelPreviewData);
      console.log(intelPreview())
      let intelDataP = intelData();
      setIntelData([]);
      return setIntelData(intelDataP);
    });
  }; 

  function time(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const processAllIntelData = async (inputData) => {
    for (const intel of inputData) {
      processPreview(intel);
    }
    await time(4000);
    if (offset() < count()) {
      console.log(intelData())
      localStorage.setItem('intelData', JSON.stringify(intelData()));
      localStorage.setItem('intelDataPreview', JSON.stringify(intelPreview()));
      setLoading(false);
    }
  };

  const procReadFile = (intel) => {
    ApiHandler.readIntelData({
      sid: intel.storage_id,
      bucket: intel.bucket_id,
    })
      .then((res) => {
        if (res.data.intel) {
          setSelectedResult({
            file: res.data.intel,
            file_name: intel.name,
            file_type: intel.bucket_data,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div class="container mx-auto p-4">
      <div class="grid md:grid-cols-2 gap-4">
        <For each={intelData()}>
          {(intel) => (
            <div class="custom-inx p-4 cursor-pointer transition duration-200 overflow-auto">
              <div class="flex cursor-pointer items-center justify-between">
              <div>
                  <span class="text-[#3999ff] font-black truncate max-w-xs inline-block">{intel.name}</span>
              </div>
                <span class="text-xs text-gray-500">{intel.date}</span>
              </div>
              <div class="text-gray-600 text-sm mt-2">{intel.bucket_data}</div>
              <div
                  class="text-[#616161] text-xs mt-2"
                  onClick={() => procReadFile(intel)}
              >
                <div
                  class="text-gray-600 text-sm mt-2 whitespace-normal max-w-md overflow-hidden"
                  innerHTML={intelPreview()
                    .find((preview) => preview.id === intel.storage_id)
                    ?.preview?.replace(/(\r\n|\n|\r)/g, "<br>")}
                ></div>
              </div>
          </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default InxSearchAndData;