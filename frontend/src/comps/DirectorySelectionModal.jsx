import React, { useEffect, useState } from "react";
import { makeRequest, notifyError, notifySuccess } from "../utils/Utils";
import { FaFolder, FaFileAlt } from "react-icons/fa";

const DirectorySelectionModal = ({ setCurrentVisibility, setSelectedDirectory }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentDirectory, setCurrentDirectory] = useState("");
    const [directoryContent, setDirectoryContent] = useState([]);
    const [previousDirectories, setPreviousDirectories] = useState([]);

    const fetchDirectoryContent = async () => {
        setLoading(true);
        try {
            let response;
            if (currentDirectory === "") {
                response = await makeRequest(
                    `${process.env.REACT_APP_BACKEND_API_URL}/api/directories`,
                    { "ngrok-skip-browser-warning": "true" },
                    "GET",
                    {},
                    {}
                );
            } else {
                response = await makeRequest(
                    "process.env.REACT_APP_BACKEND_API_URL/api/directoriesInside",
                    { "ngrok-skip-browser-warning": "true" },
                    "POST",
                    { "path": currentDirectory },
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

    useEffect(() => {
        fetchDirectoryContent()
    }, [currentDirectory]);

    return (
        <>
            <div className="fixed bg-gray-500 left-0 top-0 right-0 bottom-0 bg-opacity-75 z-50">
                <div className="md:w-3/4 w-11/12 h-3/4 absolute right-1/2 top-1/2 bg-white translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg justify-between">

                    <h1
                        className="md:text-4xl text-lg text-center w-full mb-3 py-3 bg-gray-800 text-white"
                        style={{
                            borderTopLeftRadius: "0.5rem",
                            borderTopRightRadius: "0.5rem",
                        }}
                    >
                        Select Directory
                    </h1>
                    <button
                        className="bg-gray-800 w-20 px-3 py-2 text-white h-10 my-3 mx-2 rounded-md"
                        onClick={(e) => {
                            e.preventDefault();
                            if (previousDirectories.length == 0)
                                setCurrentVisibility(false);
                            else {
                                setCurrentDirectory(previousDirectories[previousDirectories.length - 1]);
                                setPreviousDirectories((prev) => {
                                    const updatedArray = prev.slice(0, -1);
                                    return updatedArray;
                                });
                            }
                        }}
                    >
                        Back
                    </button>
                    <div className="w-full max-w-full h-4/6 flex flex-col justify-start px-4 overflow-y-scroll">
                        {loading ? (
                            <div className="text-center text-gray-600">Loading...</div>
                        ) : error ? (
                            <div className="text-center text-red-600">{error}</div>
                        ) : directoryContent.length > 0 ? (
                            <ul className="w-full">
                                {directoryContent.map((directory, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-gray-100 px-4 py-2 mb-2 rounded shadow cursor-pointer hover:bg-gray-200" onClick={() => {
                                            setPreviousDirectories([...previousDirectories, currentDirectory]);
                                            setCurrentDirectory(directory.fullPath);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FaFolder className="text-yellow-500 text-lg" />
                                            <span>{directory.name}</span>
                                        </div>

                                        <button
                                            className="w-20 px-4 py-2 bg-gray-800 text-white font-bold rounded-md hover:bg-gray-600"
                                            onClick={() => {
                                                setSelectedDirectory(directory.fullPath);
                                                setCurrentVisibility(false);
                                            }}
                                        >
                                            Select
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center text-gray-600">No directories found</div>
                        )}
                    </div>
                    <button
                        className="bg-gray-800 px-3 py-2 text-white h-10"
                        style={{
                            borderBottomLeftRadius: "0.5rem",
                            borderBottomRightRadius: "0.5rem",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentVisibility(false);
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
};

export default DirectorySelectionModal;
