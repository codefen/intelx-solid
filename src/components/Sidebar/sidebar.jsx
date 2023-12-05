//Core packages
import { createSignal, createEffect, Show, For, onMount } from "solid-js";
import { Chart, Title, Tooltip, Legend, Colors } from 'chart.js'
import { Doughnut } from 'solid-chartjs'
import history from "../../history.jsx";
import {
  FaSolidChartSimple,
  FaSolidMagnifyingGlassChart 
} from "solid-icons/fa";
import createIntel from "../../Store/intel.jsx";


function Sidebar() {
  const { intelData, setIntelData } = createIntel;
  const { intelHistory, setIntelHistory } = createIntel;
  console.log(intelHistory())
  const [processedChartData, setProcessedCharData] = createSignal(processChartData(intelData()))
  const [topIntel, setTopIntel] = createSignal(topSorted(intelData()))

  createEffect(() => {
    if (intelData() && intelData() != '') {
      setProcessedCharData(processChartData(intelData()))
      setTopIntel(topSorted(intelData()))
    }
  }, [intelData()]);

  function formatDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds); // Convert to milliseconds

    const day = date.getDate(); // Get day
    const month = date.getMonth() + 1; // Get month (0-indexed, so add 1)
    const year = date.getFullYear(); // Get year

    // Format: day/month/year
    // Pad single digits with '0' for consistency
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}


  onMount(() => {
    Chart.register(Title, Tooltip, Legend, Colors)
  })
  
  function processChartData(intelData) {
    const countMap = intelData.reduce((acc, intel) => {
      const category = intel.bucket_data || 'unknown'; // Get the category or default to 'unknown'
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
  
    const total = intelData.length;
    const labels = Object.keys(countMap);
    const data = labels.map(label => countMap[label]);
    const backgroundColors = ['#d4e9f7', '#4f9be8', '#53ace2', '#7ec0e9', '#a9d6f1']; // Add more colors if needed
    const percentages = data.map(count => (count / total * 100).toFixed(2)); // Calculate percentages
  
    return {
      datasets: [{
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: 0
      }],
      labels: labels
    };
  }
  
function topSorted(intelData) {
  const countMap = intelData.reduce((acc, intel) => {
    const category = intel.bucket_data || 'unknown'; // Get the category or default to 'unknown'
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  const sortedCategories = Object.keys(countMap)
    .map(key => ({ name: key, count: countMap[key] }))
    .sort((a, b) => b.count - a.count) // Sort by count in descending order
    .slice(0, 3); // Get top 3

  const total = intelData.length;
  const labels = sortedCategories.map(cat => cat.name);
  const data = sortedCategories.map(cat => cat.count);
  const backgroundColors = ['#d4e9f7', '#4f9be8', '#53ace2', '#7ec0e9', '#a9d6f1'];
  // Use map to preserve the order after sorting
  const percentages = sortedCategories.map(cat => ((cat.count / total) * 100).toFixed(2));

  return {
    tableData: sortedCategories.map(cat => ({ ...cat, percent: ((cat.count / total) * 100).toFixed(2) }))
  };
}
  
  const chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return (
    <>
      <aside class="sidebar flex-col items-center w-96 h-screen dark:border-gray-700">
        <section class="leaks-category bg-[#264b72] text-sm font-bold">
          <h2 class="text-white flex items-center space-x-6">
            <FaSolidChartSimple class="mr-2"/>
            LEAKS BY CATEGORY
          </h2>
          <div class="flex text-format ml-8 w-10/12 h-150 p-8  no-border-bottom">
              <Doughnut data={processedChartData()} options={chartOptions}/>
          </div>
          <div class="ml-8 w-10/12 text-white font-light no-border-bottom">
            <div class="flex text-format text-[#007bff]">
                <p class="text-base w-4/6">classification</p>
                <p class="text-base w-1/6">#</p>
                <p class="text-base w-1/6">percent</p>
            </div>
            {topIntel().tableData.map((category, index) => (
              <div key={index} class="flex text-format">
                <p class="w-4/6">{category.name}</p>
                <p class="text-base w-1/6">{category.count}</p>
                <p class="text-base w-1/6">{category.percent}%</p>
              </div>
            ))}
          </div>
        </section>
        <section class="previous-searches bg-[#1e3c5b] text-sm font-bold">
          <h2 class="text-white flex items-center space-x-6">
            <FaSolidMagnifyingGlassChart class="mr-2"/>
            PREVIOUS SEARCHES
          </h2>
          <div class="ml-8 w-10/12 text-white font-light no-border-bottom">
            <div class="flex text-format text-[#007bff]">
                <p class="text-base w-4/6">search</p>
                <p class="text-base w-2/6">date</p>
            </div>
            {intelHistory().map((category, index) => (
              <div key={index} class="flex text-format">
                <p class="w-4/6">{category.term}</p>
                <p class="text-base w-2/6">{formatDate(category.date)}</p>
              </div>
            ))}
          </div>
          <ul>
          </ul>
        </section>
      </aside>
    </>
  );
}

export default Sidebar;
