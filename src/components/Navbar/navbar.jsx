//Core packages
import { createSignal, createEffect, Show, For } from "solid-js";
import history from "../../history.jsx";
import { FaSolidGear } from "solid-icons/fa";
import createSeach from "../../Store/search.jsx";
import createModal from "../../Store/modal.jsx";


function Navbar() {
  const { searchStore, setSearchStore } = createSeach;
  const { showModal, setShowModal, setShowModalStr, showModalStr } = createModal;
  const [searchValue, setSearchValue] = createSignal('')
  const [APIValue, setAPIValue] = createSignal(window.localStorage.getItem('apikey') ? window.localStorage.getItem('apikey') : '')

  function procAPIKey() {
    return window.localStorage.setItem('apikey', APIValue());
  }

  return (
    <>
    <Show when={showModal() && showModalStr() === "api_modal"}>
      <div
        onClick={() => {
          setShowModal(!showModal());
        }}
        class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-20 z-20 py-10"
      >
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          class="max-h-[20%] h-[20%] overflow-y-hidden max-w-xl overflow-y-auto bg-white"
        >
          <div class="w-full mt-4 overflow-y-hidden	">
            <div class="w-full w-96 px-8 disable-border">
              <div class="p-3 flex">
                <p class="text-small text-left font-bold title-format">
                  Which is your API key?
                </p>
              </div>
              
              <input
                type="text"
                onChange={(e) => setAPIValue(e.target.value)}
                value={APIValue()}
                placeholder="API Key"
                class="block w-full h-full py-3 pl-4 pr-[196px] w-full bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
              
              <div class="mt-6 flex justify-center">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 transition duration-150 ease-in-out"
                  onClick={() => {
                    setShowModal(!showModal());
                    procAPIKey();
                  }}
                >
                  Confirm
                </button>
              </div>
              <div class="container flex items-center justify-center  mx-auto p-3 text-format"></div>
            </div>
          </div>
        </div>
      </div>
    </Show>
      <nav class="bg-[#007bff] pr-72">
        <div class="mx-auto px-2 sm:px-6 lg:px-8">
          <div class="relative flex items-center h-14">
            <div class="flex-1 flex items-center sm:items-stretch sm:justify-start max-w-[64px]">
              <div class="flex-shrink-0 flex items-center">
                <span onClick={() => history.push("/")} class="text-white text-xl font-bold cursor-pointer">_x</span>
              </div>
              <div class="hidden sm:block sm:ml-6">
                <div class="flex space-x-4">
                </div>
              </div>
            </div>
            <div class="flex items-center border border-gray-300 overflow-hidden mr-3 ml-12 w-[70%]">
              <input
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                class="block w-full h-full py-3 pl-4 pr-[196px] w-full bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
              <button
                onClick={() => setSearchStore(searchValue())}
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold px-4 py-2 transition duration-150 ease-in-out"
              >
                Search
              </button>
            </div>
            <div class="hover:cursor-pointer p-4">
              <FaSolidGear class="text-2xl hover:cursor-pointer"
            onClick={(e) => {
              setShowModal(!showModal());
              setShowModalStr("api_modal");
            }} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );

}

export default Navbar;
