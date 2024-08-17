import React, { useState } from "react";
import Navbar from "../comps/Navbar";

const Home = () => {
  const [navbarState, setNavbarState] = useState("deleteFiles");
  const [directory, setDirectory] = useState("");
  const [isRecursive, setIsRecursive] = useState(false);
  const [timeLimit, setTimeLimit] = useState("");
  const [minSize, setMinSize] = useState("");
  const [selectedExtensions, setSelectedExtensions] = useState([]);
  const [fileNames, setFileNames] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [sizeRange, setSizeRange] = useState({ minSize: "", maxSize: "" }); 

  const extensions = [
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".txt",
    ".docx",
    ".xlsx",
    ".mp4",
    ".mp3",
    ".zip",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle different tasks based on the navbarState
    if (navbarState === "deleteFiles") {
      // Call deleteFiles function here
      console.log({
        directory,
        isRecursive,
        timeLimit: Number(timeLimit),
        minSize: Number(minSize),
        selectedExtensions,
      });
    } else if (navbarState === "searchFiles") {
      // Call searchFiles function here
      console.log({
        directory,
        isRecursive,
        fileNames: fileNames.split(",").map(name => name.trim()), // Handle multiple names
        selectedExtensions,
        dateRange,
        sizeRange: {
          minSize: Number(sizeRange.minSize),
          maxSize: Number(sizeRange.maxSize),
        },
      });
    }
  };

  const handleExtensionChange = (e) => {
    const value = e.target.value;
    setSelectedExtensions(
      selectedExtensions.includes(value)
        ? selectedExtensions.filter((ext) => ext !== value)
        : [...selectedExtensions, value],
    );
  };

  return (
    <>
      <Navbar changeNavbarState={setNavbarState} />
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mt-5 mx-auto p-6 bg-white shadow-lg rounded-lg space-y-6"
      >
        {/* Directory Input */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Directory</label>
          <input
            type="text"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            placeholder="Enter the directory"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Recursive Flag */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isRecursive}
            onChange={(e) => setIsRecursive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-gray-700 font-bold">Recursive</label>
        </div>

        {/* Time Limit - Only for Delete Files */}
        {navbarState === "deleteFiles" && (
          <>
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Time Limit (Days)
              </label>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Enter time limit in days"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Minimum File Size (MB)
              </label>
              <input
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
                min="1"
                placeholder="Enter minimum file size in MB"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </>
        )}

        {/* File Names - Only for Search Files */}
        {navbarState === "advancedSearch" && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              File Names (comma-separated)
            </label>
            <input
              type="text"
              value={fileNames}
              onChange={(e) => setFileNames(e.target.value)}
              placeholder="Enter file names separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* File Extensions */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">File Extensions</label>
          <div className="grid grid-cols-2 gap-4">
            {extensions.map((ext) => (
              <div key={ext} className="flex items-center">
                <input
                  type="checkbox"
                  value={ext}
                  onChange={handleExtensionChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700">{ext}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Date Range - Only for Search Files */}
        {navbarState === "advancedSearch" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {/* Size Range - Only for Search Files */}
        {navbarState === "advancedSearch" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Min Size (MB)
              </label>
              <input
                type="number"
                value={sizeRange.minSize}
                onChange={(e) =>
                  setSizeRange({ ...sizeRange, minSize: e.target.value })
                }
                placeholder="Enter minimum file size"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Max Size (MB)
              </label>
              <input
                type="number"
                value={sizeRange.maxSize}
                onChange={(e) =>
                  setSizeRange({ ...sizeRange, maxSize: e.target.value })
                }
                placeholder="Enter maximum file size"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-600"
          >
            {navbarState === "deleteFiles" && "Delete Files"}
            {navbarState === "groupFiles" && "Group Files"}
            {navbarState === "groupFilesDates" && "Group Files (Dates)"}
            {navbarState === "advancedSearch" && "Search Files"}
            {navbarState === "directoryStalker" && "Stalk Directory"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Home;
