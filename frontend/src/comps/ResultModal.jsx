import { memo, useEffect, useState } from "react";


const ResultModal = ({ setCurrentVisibility, modalData, previousScreen,fileType }) => {
    const [selectedExtension, setSelectedExtension] = useState("null");

    useEffect(() => {
        setSelectedExtension(modalData.keys().next().value);
    }, []);
    return (
        <>
            <div className="fixed bg-gray-500 left-0 top-0 right-0 bottom-0 bg-opacity-75">
                <div className="w-3/4 h-3/4 absolute right-1/2 top-1/2 bg-white translate-x-1/2 -translate-y-1/2 flex flex-col rounded-lg overflow-hdden justify-between">
                    <h1 className="text-4xl text-center w-full mb-3 py-3 bg-gray-800 text-white" style={{
                        "borderTopLeftRadius": "0.5rem",
                        "borderTopRightRadius": "0.5rem"
                    }}>Result</h1>
                    <div className="w-full max-w-full h-4/6 flex flex-col justify-start">
                        <div className="w-full max-w-full flex-wrap flex justify-start h-max-content mb-3 px-2">
                            {Array.from(modalData).map(([key, array]) => {
                                return <ExtensionButton extension={key} setSelectedExtension={setSelectedExtension} selectedExtension={selectedExtension} size={array.length} />
                            })}
                        </div>

                        <div className="w-full max-w-full flex flex-col justify-start h-full px-2 overflow-y-scroll">
                            <table>
                                <thead>
                                    <th>File Location:</th>
                                    <th>File Name:</th>
                                    <th>File Size ({fileType}):</th>
                                </thead>
                                <tbody>
                                {Array.from(modalData).map(([key, array]) => {
                                    if (key === selectedExtension){

                                        if(previousScreen==="GROUP"){
                                            return array.map(({destinationPath, fileName, fileSize}, index) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>{destinationPath}</td>
                                                            <td>{fileName}</td>
                                                            <td>{fileSize}</td>
                                                        </tr>
                                                    </>
                                                )
                                            });
                                        }
                                        else{
                                            return array.map(({fullPath, fileName, fileSize}, index) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>{fullPath}</td>
                                                            <td>{fileName}</td>
                                                            <td>{fileSize}</td>
                                                        </tr>
                                                    </>
                                                )
                                            });
                                        }
                                    }
                                })}
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <button className="bg-gray-800 px-3 py-2 text-white h-10" style={{
                        "borderBottomLeftRadius": "0.5rem",
                        "borderBottomRightRadius": "0.5rem"
                    }} onClick={(e) => {
                        e.preventDefault();
                        setCurrentVisibility(false);
                    }}>Close</button>
                </div>
            </div>
        </>
    );
};

const ExtensionButton = ({ extension, setSelectedExtension, selectedExtension, size }) => {
    return (
        <>
            <button className={(selectedExtension === extension) ? "bg-white px-2 py-1 text-gray-800 border-solid border-2 border-gray-800 h-8" : "bg-gray-800 px-2 py-1 text-white h-8"} onClick={(e) => {
                e.preventDefault();
                setSelectedExtension(extension)
            }}>{extension}({size})</button>
        </>
    );
}

export default ResultModal;