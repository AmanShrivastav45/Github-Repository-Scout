import { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import "../font/stylesheet.css";
import { HiOutlineClipboard } from "react-icons/hi2";
import { BsGithub } from "react-icons/bs";
import toast from "react-hot-toast";

const Home = () => {
    const [userName, setUserName] = useState<string>("");
    const [repos, setRepos] = useState<string[]>([]);
    const [repoLink, setRepoLink] = useState<string>("");
    const [selectedRepo, setSelectedRepo] = useState<string>("");
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

    const handleUserSubmit = async () => {
        if (!userName) {
            toast.error("Enter your Username first");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`${import.meta.env.VITE_SERVER_URL}/${userName}`);
            setRepos(data);
            setSelectedRepo("");
            setFileStructure([]);
        } catch (error) {
            console.error("Error fetching repositories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkSubmit = async () => {
        if (!repoLink) {
            toast.error("Please enter a GitHub repository link.");
            return;
        }

        try {
            const match = repoLink.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match || match.length < 3) {
                console.error("Invalid GitHub repo link.");
                return;
            }

            const username = match[1];
            const repoName = match[2];

            setUserName(username);
            setSelectedRepo(repoName);

            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/${username}/${repoName}/structure`
            );
            setFileStructure(data.structure);
        } catch (error) {
            console.error("Error fetching repo structure:", error);
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

    const handleRepoSubmit = async () => {
        if (!selectedRepo) {
            toast.error("Select a repository first");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/${userName}/${selectedRepo}/structure`
            );
            setFileStructure(data.structure);
        } catch (error) {
            console.error("Error fetching file structure:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
            <div className="h-32 lg:h-40 w-full border-b border-[#2e2e2e] text-gray-100 flex items-center justify-center">
                <div className="xl:w-[1240px] w-full flex items-center justify-between">
                    <div className="px-5">
                        <h1 className="text-2xl lg:text-3xl Geist-Semibold mb-1 flex gap-2 items-center"><BsGithub size={24} />Explore GitHub Repositories.</h1>
                        <p className="Geist text-xs sm:text-sm lg:text-base text-gray-400">Discover and inspect the file structures of any GitHub repository with ease. Just search your profile and select a repository.</p>
                    </div>
                    <div className="hidden lg:block">
                        <button className="bg-green-300">Reach out</button>
                    </div>
                </div>
            </div>
            <div className="h-[calc(100%-8rem)] w-full flex flex-col items-center justify-start xl:w-[1240px] py-2 Geist">
                <div className="h-12 w-full flex items-center justify-between text-white mt-2 sm:mt-4 px-4">
                    <input value={repoLink}
                        onChange={(e) => setRepoLink(e.target.value.toLowerCase())} className="w-[90%] lowercase h-full px-3 sm:px-4 bg-[#1a1a1a] rounded-[5px] outline-none focus:ring-1 focus:ring-[#3a3a3a] text-sm" placeholder="Paste your repository link here" />
                    <button onClick={handleLinkSubmit} className="bg-purple-500 h-full px-3 cursor-pointer rounded-[5px] text-sm ml-2">Generate</button>
                </div>
                <div className="h-full w-full mt-1 flex items-center justify-center gap-4 px-4">
                    <div className="h-full hidden sm:block sm:w-[50%] py-3">
                        <div className="bg-[#09090b] p-4 h-full w-full rounded-[5px]">
                            <div className="h-10 w-full flex items-center justify-between text-white mt-4">
                                <input
                                    value={userName}
                                    className="w-[90%] h-full px-4 bg-[#1a1a1a] rounded-[5px] outline-none focus:ring-1 focus:ring-[#3a3a3a] lowercase"
                                    onChange={(e) => setUserName(e.target.value.toLowerCase())}
                                    placeholder="Enter your username"
                                />
                                <button onClick={handleUserSubmit} className="bg-purple-500 h-full px-3 cursor-pointer rounded-[5px]">Search</button>
                            </div>
                            {repos.length > 0 && (
                                <>
                                    <select
                                        value={selectedRepo}
                                        onChange={(e) => setSelectedRepo(e.target.value)}
                                        className="bg-gray-700 text-white p-2 rounded w-fit"
                                    >
                                        <option value="">-- Select a repository --</option>
                                        {repos.map((repo, i) => (
                                            <option key={i} value={repo}>
                                                {repo}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="bg-blue-500 px-4 py-1 rounded hover:bg-blue-600 w-fit cursor-pointer"
                                        onClick={handleRepoSubmit}
                                    >
                                        Get File Structure
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="h-full w-full xl:w-[50%] py-3">
                        <div className="h-10 w-full bg-[#2a2a2a] text-white rounded-t-[5px] flex items-center justify-end px-2">
                            <button
                                onClick={handleCopy}
                                className=" p-2 rounded-full hover:bg-[#09090b] text-white ml-2"
                                title="Copy to clipboard"
                            >
                                <HiOutlineClipboard size={16} />
                            </button>
                        </div>
                        {loading ? (
                            <Loader />
                        ) : (
                            <textarea readOnly rows={20} value={fileStructure.length ? fileStructure.join("\n") : dummyStructure.join("\n")}
                                className="bg-[#1a1a1a] text-green-400 Fira-Code text-sm sm:text-base rounded-b-[5px] resize-none h-full w-full outline-none p-4">
                            </textarea>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home