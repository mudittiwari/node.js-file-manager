import React, { useState } from "react";
import Navbar from "../comps/Navbar";
import { NavbarState } from "../utils/Constants";
import { makeRequest, notifyError, notifySuccess, compareArrays, removeItemFromArray } from "../utils/Utils";
import { Toaster } from "react-hot-toast";
import ResultModal from "../comps/ResultModal";
import LoadingBar from "../Loadingbar";
import { useEffect } from "react";
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
  const [loading, setLoading] = useState(false)
  const [fileTypeSize, setFileTypeSize] = useState("KB")
  const [previousScreen,setPreviousScreen]=useState("")


  useEffect(() => {
    setDirectory("")
    setIsRecursive(false)
    setTimeLimit("")
    setMinSize("")
    setSelectedExtensions([])
    setFileNames("")
    setDateRange({ startDate: "", endDate: "" })
    setSizeRange({ minSize: "", maxSize: "" })
    setFileTypeSize("KB")
  }, [navbarState])

  const extensions = [
    "All",
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "txt",
    "docx",
    "xlsx",
    "mp4",
    "mp3",
    "zip",
  ];
  const [currentlyVisible, setCurrentVisibility] = useState(false);
  const [modalData, setModalData] = useState(null)



  const showModal = (resultMap) => {
    const parsedMap = new Map(resultMap);
    setCurrentVisibility(true);
    setModalData(parsedMap);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (navbarState === NavbarState.GROUP_FILES) {
      if (directory.length == 0) {
        notifyError("Please enter directory");
        return;
      }
      if (selectedExtensions.length == 0) {
        notifyError("Please select file extensions");
        return;
      }
      setLoading(true);
      let selectedExtensionsService=removeItemFromArray(selectedExtensions,"All");
      let response = await makeRequest("http://localhost:5000/groupFiles", {}, "POST", {
        directory,
        isRecursive,
        selectedExtensionsService,
      }, {});
      if (response && response.status === 200) {
        setLoading(false)
        if (response.data.resultMap) {
          if (Array.from(response.data.resultMap).length == 0) {
            notifyError("No Result")
            return;
          }
          notifySuccess(response.data.message)
          setPreviousScreen("GROUP")
          showModal(response.data.resultMap);
        }
      } else {
        setLoading(false);
        notifyError(response.response.data.error);
      }
    }


    else if (navbarState === NavbarState.GROUP_FILES_DATES) {
      if (directory.length == 0) {
        notifyError("Please enter directory");
        return;
      }
      if (selectedExtensions.length == 0) {
        notifyError("Please select file extensions");
        return;
      }
      setLoading(true);
      let selectedExtensionsService=removeItemFromArray(selectedExtensions,"All");
      let response = await makeRequest("http://localhost:5000/groupFilesDates", {}, "POST", {
        directory,
        isRecursive,
        selectedExtensionsService,
      }, {});
      if (response && response.status === 200) {
        setLoading(false)
        if (response.data.resultMap) {
          if (Array.from(response.data.resultMap).length == 0) {
            notifyError("No Result")
            return;
          }
          notifySuccess(response.data.message)
          setPreviousScreen("GROUP")
          showModal(response.data.resultMap);
        }
      } else {
        setLoading(false);
        notifyError(response.response.data.error);
      }
    }
    else if (navbarState === NavbarState.DELETE_FILES) {
      if (directory.length == 0) {
        notifyError("Please enter directory");
        return;
      }
      if (selectedExtensions.length == 0) {
        notifyError("Please select file extensions");
        return;
      }
      setLoading(true);
      let mininumSize = minSize;
      if (fileTypeSize === "MB") {
        let size = minSize;
        size = 1024 * size;
        mininumSize = size;
      }
      else if (fileTypeSize === "GB") {
        let size = minSize;
        size = 1024 * 1024 * size;
        mininumSize = size;
      }
      let selectedExtensionsService=removeItemFromArray(selectedExtensions,"All");
      let response = await makeRequest("http://localhost:5000/deleteFiles", {}, "POST", {
        directory,
        isRecursive,
        selectedExtensionsService,
        timeLimit,
        mininumSize
      }, {});
      if (response && response.status === 200) {
        setLoading(false)
        if (response.data.resultMap) {
          if (Array.from(response.data.resultMap).length == 0) {
            notifyError("No Result")
            return;
          }
          notifySuccess(response.data.message)
          setPreviousScreen("DELETE")
          showModal(response.data.resultMap);
        }
      } else {
        setLoading(false)
        notifyError(response.response.data.error);
      }
    }
    else if (navbarState === NavbarState.ADVANCED_SEARCH) {
      if (directory.length == 0) {
        notifyError("Please enter directory");
        return;
      }
      if (selectedExtensions.length == 0) {
        notifyError("Please select file extensions");
        return;
      }
      setLoading(true)

      let mininumSize = Number(sizeRange.minSize);
      let maximumSize = Number(sizeRange.maxSize);
      if (fileTypeSize === "MB") {
        let size = mininumSize;
        size = 1024 * size;
        mininumSize = size;
        size = maximumSize;
        size = 1024 * size;
        maximumSize = size;
      }
      else if (fileTypeSize === "GB") {
        let size = mininumSize;
        size = 1024 * 1024 * size;
        mininumSize = size;
        size = maximumSize;
        size = 1024 * 1024 * size;
        maximumSize = size;
      }
      let selectedExtensionsService=removeItemFromArray(selectedExtensions,"All");
      let response = await makeRequest("http://localhost:5000/searchFiles", {}, "POST", {
        directory,
        isRecursive,
        fileNames: fileNames.split(",").map(name => name.trim()),
        selectedExtensionsService,
        dateRange,
        sizeRange: {
          minSize: mininumSize,
          maxSize: maximumSize,
        },
      }, {});
      if (response && response.status === 200) {
        setLoading(false)
        if (response.data.resultMap) {
          if (Array.from(response.data.resultMap).length == 0) {
            notifyError("No Result")
            return;
          }
          notifySuccess(response.data.message)
          setPreviousScreen("SEARCH")
          showModal(response.data.resultMap);
        }
      } else {
        setLoading(false)
        notifyError(response.response.data.error);
      }
    }
  };

  const handleExtensionChange = (e) => {
    const value = e.target.value;
    if (value == "All") {
      if (compareArrays(selectedExtensions,extensions)) {
        setSelectedExtensions([]);
      }
      else {
        setSelectedExtensions(extensions);
      }
    }
    else {
      setSelectedExtensions(
        selectedExtensions.includes(value)
          ? selectedExtensions.filter((ext) => ext !== value)
          : [...selectedExtensions, value],
      );
    }
  };

  return (
    <>
      <Toaster />
      {loading && <LoadingBar />}
      {
        currentlyVisible && <ResultModal setCurrentVisibility={setCurrentVisibility} modalData={modalData} previousScreen={previousScreen} fileType={fileTypeSize} />
      }
      <Navbar changeNavbarState={setNavbarState} navbarState={navbarState} />
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
          />
        </div>

        {/* Recursive Flag */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isRecursive}
            onChange={(e) => setIsRecursive(e.target.checked)}
            className="h-4 w-4 text-gray-800 accent-gray-800 focus:ring-blue-500 border-gray-300 rounded"
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
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Minimum File Size
              </label>
              <div className="flex">
                <div className="mr-2" style={{ "border": "1px solid rgb(31 41 55 / var(--tw-bg-opacity))" }}>
                  <Dropdown setFileTypeSize={setFileTypeSize} fileTypeSize={fileTypeSize} />
                </div>
                <input
                  type="number"
                  value={minSize}
                  onChange={(e) => setMinSize(e.target.value)}
                  min="1"
                  placeholder={`Enter minimum file size in ${fileTypeSize}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
                  checked={ext === "All" ? selectedExtensions.length == 11 : selectedExtensions.includes(ext)}
                  onChange={handleExtensionChange}
                  className="h-4 w-4 text-gray-800 accent-gray-800 focus:ring-blue-500 border-gray-300 rounded"
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
                  setDateRange({ startDate: e.target.value, endDate:"" })
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
                min={dateRange.startDate}
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
                Min Size
              </label>
              <div className="flex">
                <div className="mr-2" style={{ "border": "1px solid rgb(31 41 55 / var(--tw-bg-opacity))" }}>
                  <Dropdown setFileTypeSize={setFileTypeSize} fileTypeSize={fileTypeSize} />
                </div>
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

            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Max Size
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



const Dropdown = ({ setFileTypeSize, fileTypeSize }) => {
  return (
    <>
      <select className="h-full px-1" value={fileTypeSize} onChange={(e) => {
        setFileTypeSize(e.target.value);
      }}>
        <option value="KB">KB</option>
        <option value="MB">MB</option>
        <option value="GB">GB</option>
      </select>
    </>
  );
}