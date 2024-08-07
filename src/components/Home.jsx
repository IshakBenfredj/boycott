import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import Post from "./Post";
import { Helmet } from "react-helmet";
import SearchIcon from '@mui/icons-material/Search';
import categories from "../constants/categories";
import _ from "lodash";

// eslint-disable-next-line react/prop-types
export default function Home({ user }) {
    const [data, setData] = useState([]);
    const [dataSearch, setDataSearch] = useState([]);
    const [category, setCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        const fetchAll = async () => {
            const { data, error } = await supabase
                .from('boycott')
                .select("*")
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching data:', error);
            } else {
                setData(data);
                setDataSearch(data);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        let filteredData = data;

        if (category && category !== "الكل") {
            filteredData = filteredData.filter(d => d.category === category);
        }

        if (searchTerm) {
            filteredData = filteredData.filter(d =>
                d.productb.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortOrder === "newest") {
            filteredData = _.orderBy(filteredData, ['created_at'], ['desc']);
        } else if (sortOrder === "oldest") {
            filteredData = _.orderBy(filteredData, ['created_at'], ['asc']);
        } else if (sortOrder === "mostInteracted") {
            filteredData = _.orderBy(filteredData, [(d) => d.likes.length], ['desc']);
        } else if (sortOrder === "leastInteracted") {
            filteredData = _.orderBy(filteredData, [(d) => d.likes.length], ['asc']);
        }

        // if (sortOrder === "newest") {
        //     filteredData = filteredData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        // } else if (sortOrder === "oldest") {
        //     filteredData = filteredData.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        // } else if (sortOrder === "mostInteracted") {
        //     filteredData = filteredData.sort((a, b) => b.likes.length - a.likes.length);
        // } else if (sortOrder === "leastInteracted") {
        //     filteredData = filteredData.sort((a, b) => a.likes.length - b.likes.length);
        // }

        setDataSearch(filteredData);
    }, [category, searchTerm, sortOrder, data]);

    return (
        <div className="h-full">
            <Helmet>
                <title>لنقاطع | الرئيسية</title>
            </Helmet>
            <div className="bg-green-800/85 py-4 w-full md:px-6 px-4 flex justify-between items-center md:flex-row flex-col gap-5 mb-10">
                <div className="bg-green-400 rounded-full flex items-center p-1 md:w-1/2">
                    <input
                        type="search"
                        className="bg-transparent outline-none border-none text-black w-full h-full px-3 placeholder:text-black"
                        placeholder="البحث عن منتج مقاطع"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="bg-white rounded-full h-10 w-11 flex items-center justify-center">
                        <SearchIcon />
                    </div>
                </div>
                <div className="flex items-center md:w-1/2 w-full justify-around">
                    <div className="flex items-center gap-3 text-white">
                        <span>الفلترة :</span>
                        <select className="text-black" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option disabled selected={!category}>إختر النوع</option>
                            <option>الكل</option>
                            {categories.map((c, i) => (
                                <option value={c} key={i}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                        <span>الترتيب :</span>
                        <select className="text-black" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="newest">من الأحدث</option>
                            <option value="oldest">من الأقدم</option>
                            <option value="mostInteracted">الأكثر تفاعلا</option>
                            <option value="leastInteracted">الأقل تفاعلا</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="mx-auto md:w-2/3 space-y-4 md:p-4 p-2 flex flex-col">
                {
                    !dataSearch.length ? <div>لا يوجد نتائج بحث أو فلترة</div> : dataSearch.map(d =>
                        <Post post={d} key={d.id} userLog={user} setPosts={setData} posts={data} />
                    )
                }
            </div>
        </div>
    );
}
