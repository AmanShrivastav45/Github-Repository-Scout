import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import "../font/stylesheet.css";
import { HiOutlineClipboard } from "react-icons/hi2";
import toast from "react-hot-toast";
import TextArea from "../components/Textarea";
import { FaLinkedinIn } from "react-icons/fa";
import { Background } from "../components/Background";
import { BsStars } from "react-icons/bs";
import { PiTreeViewFill } from "react-icons/pi";
import { Link } from "react-router-dom";

const Home = () => {
    const [repoLink, setRepoLink] = useState<string>("");
    const [fileStructure, setFileStructure] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const dummyStructure = [
        "Repository Scout",
        "├── src",
        "│   ├── components",
        "│   │   └── Header.js",
        "│   ├── App.js",
        "│   └── index.js",
        "├── public",
        "│   └── index.html",
        "├── .gitignore",
        "├── package.json",
        "└── README.md",
    ];

    const handleLinkSubmit = async () => {
        if (!repoLink) {
            toast.error("Please enter a GitHub repository link.");
            return;
        }

        try {
            setLoading(true)
            const match = repoLink.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match || match.length < 3) {
                toast.error("Please enter a valid GitHub Repository.");
                return;
            }

            const username = match[1];
            const repoName = match[2];

            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${username}/${repoName}/structure`);
    
            if (response.status === 200) {
                setFileStructure([repoName, ...response.data.structure]);
            } else {
                toast.error("Repository not found or is invalid.");
            }
            setFileStructure([repoName, ...response.data.structure]);
        } catch (error) {
            console.error("Error fetching repo structure:", error);
        } finally {
            setLoading(false)
        }
    };

    const handleCopy = () => {
        if (fileStructure.length === 0) {
            toast.error("Enter your repository first!")
            return;
        }
        navigator.clipboard.writeText(fileStructure.join('\n')).then(() => {
            toast.success("File structure copied to clipboard!");
        }).catch((err) => {
            toast.error("Failed to copy!")
            console.error("Failed to copy: ", err);
        });
    };

    return (
        <Background>
            <div style={{ zIndex: 20000 }} className="absolute z-50 inset-0 h-screen w-full moving-gradient-bg flex flex-col items-center justify-start sm:justify-start mt-16 hide-scrollbar">
                <div style={{ zIndex: 20000 }} className="fixed z-50 top-0 h-16 w-full border-b border-[#2e2e2e] text-gray-100 flex justify-center">
                    <div className="xl:w-[1280px] px-4 w-full h-full flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PiTreeViewFill size={24} />
                            <h1 className="text-xl mt-0.5">Repository Scout</h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link target="_blank" to={"https://www.linkedin.com/in/aman-shrivastav-592110253/"} className="bg-[#5e35b1] flex items-center justify-center rounded-[5px] h-8 w-8">
                                <FaLinkedinIn size={20} className="text-white" />
                            </Link>
                            <Link target="_blank" to={"https://github.com/AmanShrivastav45/Github-Repository-Scout"} className="cursor-pointer bg-[#5e35b1] h-8 flex items-center justify-center rounded-[5px] px-2 sm:px-3 text-sm ">Readme.md</Link>
                        </div>
                    </div>
                </div>
                <div className="h-[720px] w-full flex flex-col lg:flex-row items-center justify-between xl:w-[1280px] sm:py-3 Geist">
                    <div className="h-auto sm:h-full w-full lg:w-[50%] py-4 px-2">
                        <div className="p-4 py-0 h-auto sm:h-full w-full rounded-[5px] ">
                            <div className="w-full h-full flex flex-col items-center justify-center text-white">
                                <div className="flex flex-col items-center w-full lg:mb-24">
                                    <div className="flex flex-col w-full">
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl Geist-Semibold mb-2 flex gap-2 items-center">Explore GitHub Repositories, Effortlessly.</h1>
                                        <p className="Geist text-xs sm:text-sm lg:text-base text-gray-400">Discover and inspect the file structures of any GitHub repository with ease. Just paste your repository link below and click on generate.</p>
                                    </div>
                                    <div className="mt-4 w-full flex">
                                        <input value={repoLink} onChange={(e) => setRepoLink(e.target.value.toLowerCase())}
                                            className="w-[90%] lowercase h-10 sm:h-12 px-3 sm:px-4 bg-[#1e1e1e] rounded-[5px] outline-none border border-[#3e3e33] focus:ring-1 focus:ring-gray-700 text-sm md:text-base" placeholder="Paste your repository link here" />
                                        <button onClick={handleLinkSubmit} className="bg-[#5e35b1] h-10 sm:h-12 px-3 cursor-pointer rounded-[5px] text-sm md:text-base ml-2">Generate</button>
                                    </div>
                                    <p className="text-gray-400 hidden lg:flex text-base mt-5 w-full gap-2">
                                        <BsStars size={20} className="text-amber-400" />Created by Aman Shrivastav
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="h-[85%] w-full lg:w-[45%] relative px-6 lg:px-4">
                        <button onClick={handleCopy} title="Copy to clipboard" className="p-2 rounded-full bg-[#2e2e2e] hover:bg-[#3a3a3a] absolute right-9 lg:right-7 top-3 text-white ml-2">
                            <HiOutlineClipboard size={16} />
                        </button>
                        <div style={{ zIndex: 20000 }} className="h-[440px] sm:h-full z-10">
                            {loading ? (<Loader />) : (<TextArea fileStructure={fileStructure} dummyStructure={dummyStructure} />)}
                        </div>
                        <p className="text-gray-400 lg:hidden text-xs sm:text-sm md:text-base mt-5 w-full flex items-center justify-center gap-1">
                            <BsStars size={20} className="text-amber-400" />Created by Aman Shrivastav
                        </p>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export default Home