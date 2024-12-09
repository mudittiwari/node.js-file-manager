import React, { useState, useEffect, useContext } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "../comps/Navbar";
import LoadingBar from "../Loadingbar";
import { makeRequest, notifyError, notifySuccess } from "../utils/Utils";
import { FaFolder, FaFileAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CutCopyState, NavbarState } from "../utils/Constants";
import DirectorySelectionModal from "../comps/DirectorySelectionModal";
import navbarContext from "../context/NavbarContext";
const DirectoryViewer = () => {
  const [loading, setLoading] = useState(false);
  const [directoryContent, setDirectoryContent] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRenamePopupVisible, setRenamePopupVisible] = useState(false);
  const [isDirectorySelectionPopupVisible, setDirectorySelectionPopupVisible] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const {navbarState, setNavbarState} = useContext(navbarContext);
  const [currentVisibility, setCurrentVisibility] = useState(false);
  const [cutCopyState, setCutCopyState] = useState("");
  const [cutCopyDestination, setCutCopyDestination] = useState("");
  const [cutCopySource, setCutCopySource] = useState("");

  const renameFile = async (currentFilePath, newFileName) => {
    setLoading(true);
    try {
      let response = await makeRequest(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/renameFile`,
        {},
        "POST",
        {
          "filePath": currentFilePath,
          "newName": newFileName
        },
        {}
      );
      if (response.status === 200) {
        notifySuccess(response.data.message);
        fetchDirectoryContent();
      } else {
        notifyError("Failed to rename file.");
      }
    } catch (error) {
      notifyError(error.message || "Error renaming file.");
    } finally {
      setLoading(false);
    }
  }

  const handleRenameClick = (filePath) => {
    setCurrentFilePath(filePath);
    setNewFileName("");
    setRenamePopupVisible(true);
  };

  const cutCopyFile = async () => {
    setLoading(true);
    try {
      let response = await makeRequest(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/copyOrCutFile`,
        {},
        "POST",
        {
          "sourcePath": cutCopySource,
          "destinationPath": cutCopyDestination,
          "operation": cutCopyState
        },
        {}
      );
      if (response.status === 200) {
        notifySuccess(response.data.message);
        fetchDirectoryContent();
      } else {
        notifyError(`Failed to ${cutCopyState} file.`);
      }
    } catch (error) {
      notifyError(error.message || `Error in ${cutCopyState} operation.`);
    } finally {
      setLoading(false);
    }
  }

  const handleCopyCutButtonSubmit = () => {
    setDirectorySelectionPopupVisible(false);
    if (cutCopyDestination.length == 0) {
      notifyError("please select destination");
    }
    cutCopyFile();
  }

  const handleCutCopyButtonClick = (currentFilePath, cutCopyState) => {
    console.log(currentFilePath);
    setDirectorySelectionPopupVisible(true);
    setCutCopyState(cutCopyState);
    setCutCopySource(currentFilePath);
    setCutCopyDestination("");
  }

  const handleRenameSubmit = () => {
    if (!newFileName.trim()) {
      alert("Please provide a valid new name!");
      return;
    }
    renameFile(currentFilePath, newFileName);
    setRenamePopupVisible(false);
  };


  const fetchDirectoryContent = async () => {
    const directoryPath = searchParams.get("path") || "/";
    setLoading(true);
    try {
      let response;
      if (directoryPath === "/" || !directoryPath) {
        response = await makeRequest(
          `${process.env.REACT_APP_BACKEND_API_URL}/api`,
          { "ngrok-skip-browser-warning": "true" },
          "GET",
          {},
          {}
        );
      } else {
        response = await makeRequest(
          `${process.env.REACT_APP_BACKEND_API_URL}/api/subdirectory`,
          { "ngrok-skip-browser-warning": "true" },
          "POST",
          { "path": directoryPath },
          {}
        );
      }
      if (response.status === 200) {
        setDirectoryContent(response.data.result);
      } else {
        notifyError("Failed to fetch directory content");
      }
    } catch (error) {
      notifyError(error.message || "Error fetching directory content");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (path) => {
    setLoading(true);
    try {
      let response = await makeRequest(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/deleteFile`,
        {},
        "POST",
        { "path": path },
        {}
      );
      if (response.status === 200) {
        notifySuccess(response.data.message);
        fetchDirectoryContent();
      } else {
        notifyError("Failed to delete file");
      }
    } catch (error) {
      notifyError(error.message || "Error deleting file");
    } finally {
      setLoading(false);
    }
  }

  const downloadFile = async (filePath) => {
    setLoading(true);
    try {
      if (!filePath) {
        throw new Error("File path is required.");
      }
      let response = await makeRequest(
        `${process.env.REACT_APP_BACKEND_API_URL}/api/downloadFile`,
        { "ngrok-skip-browser-warning": "true" },
        "GET",
        {},
        { "path": filePath },
        'blob'
      );
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1].replace(/"/g, "")
        : "downloaded-file";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      notifySuccess("File downloaded successfully");
    } catch (error) {
      notifyError("Error downloading file:", error.message);
    } finally{
      setLoading(false);
    }
  };




  const renderContent = () => {
    if (!directoryContent || directoryContent.length === 0) {
      return <p className="text-gray-500">No content available for the directory.</p>;
    }

    return (
      <>
        <ul className="space-y-2">
          {directoryContent.map((item, index) => (
            <li
              key={index}
              className={`flex items-center justify-between space-x-3 p-2 border border-gray-300 rounded-md shadow-sm ${item.type === "directory" ? "hover:bg-gray-100 cursor-pointer" : ""
                }`}
              onClick={() => {
                if (item.type === "directory") {
                  navigate(`/directory?path=${encodeURIComponent(item.fullPath)}`);
                }
              }}
            >
              <div className="flex items-center space-x-3">
                {item.type === "directory" ? (
                  <FaFolder className="text-yellow-500 text-lg" />
                ) : (
                  <FaFileAlt className="text-gray-500 text-lg" />
                )}
                <span className="text-gray-800 font-medium max-w-[75%] md:max-w-max break-words">{item.name}</span>
              </div>
              {item.type === "file" && (
                <div className="flex space-x-3 text-gray-500">
                  <button
                    title="Rename"
                    className="hover:text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Rename: ${item.name}`);
                      handleRenameClick(item.fullPath);
                    }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    title="Copy"
                    className="hover:text-green-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCutCopyButtonClick(item.fullPath, CutCopyState.COPY);
                    }}
                  >
                    <i className="fas fa-copy"></i>
                  </button>
                  <button
                    title="Cut"
                    className="hover:text-yellow-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCutCopyButtonClick(item.fullPath, CutCopyState.CUT);
                    }}
                  >
                    <i className="fas fa-cut"></i>
                  </button>
                  <button
                    title="Delete"
                    className="hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(item.fullPath);
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                  <button
                    title="Download"
                    className="hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`Download: ${item.name}`);
                      downloadFile(item.fullPath);
                    }}
                  >
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {isRenamePopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-lg font-medium mb-4">Rename File</h2>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new file name"
                className="border border-gray-300 p-2 rounded w-full mb-4"
              />
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setRenamePopupVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-600" onClick={handleRenameSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}



        {isDirectorySelectionPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded shadow-md" style={{ width: '800px' }}>
              <h2 className="text-lg font-medium mb-4">{cutCopyState} File</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Directory
                </label>

              </div>
              <div className="mb-4 flex">
                <input
                  type="text"
                  value={cutCopyDestination || "No directory selected"}
                  disabled
                  className="border border-gray-300 p-2 rounded w-full bg-gray-100 cursor-not-allowed"
                />
                <button
                  className="w-32 px-4 ml-2 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-600"
                  onClick={() => setCurrentVisibility(true)}
                >
                  Select
                </button>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setDirectorySelectionPopupVisible(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-32 px-4 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-600"
                  onClick={handleCopyCutButtonSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

      </>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("fileManagerJwtToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDirectoryContent();
  }, [searchParams])

  return (
    <>
      <Toaster />
      {loading && <LoadingBar />}
      <Navbar changeNavbarState={setNavbarState} navbarState={navbarState} />
      {currentVisibility && <DirectorySelectionModal setCurrentVisibility={setCurrentVisibility} setSelectedDirectory={setCutCopyDestination} />}

      <div className="max-w-3xl mx-auto mt-5 md:p-6 p-2 bg-white shadow-lg rounded-lg space-y-6">
        <div>
          <h2 className="text-gray-700 font-bold text-lg mb-4">Home Directory</h2>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default DirectoryViewer;