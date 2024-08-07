/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import supabase from "../lib/supabase";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DoDisturbAltOutlinedIcon from '@mui/icons-material/DoDisturbAltOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import Reacting from "./Reacting";
import isSure from "../lib/swal";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns'; // Importing date-fns for time ago formatting
import { ar } from 'date-fns/locale'; // Importing Arabic locale for date-fns

export default function Post({ post, userLog, setPosts, posts }) {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', post.userId)
                    .single();

                if (error) {
                    console.log(error);
                    setLoading(false);
                    return;
                }

                setUser(user);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };
        fetchUser();
    }, [post]);

    const deletePost = async () => {
        const confirmed = await isSure("هل ترغب فعلا في حذف هذه المقاطعة ؟");
        if (confirmed) {
            try {
                const { error } = await supabase
                    .from('boycott')
                    .delete()
                    .eq('id', post.id);

                if (error) {
                    console.error('Error deleting post:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'خطأ',
                        text: 'حدث خطأ أثناء حذف المقاطعة.',
                    });
                } else {
                    if (posts) {
                        const fposts = posts.filter(p => p.id !== post.id);
                        setPosts(fposts);
                    }
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف',
                        text: 'تم حذف المقاطعة بنجاح.',
                    });
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error("Error deleting post:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'حدث خطأ أثناء حذف المقاطعة.',
                });
            }
        }
    };

    return (
        <>
            {loading ? (
                <CircularProgress className="mx-auto" />
            ) : (
                <div className="bg-white md:p-4 py-4 px-2 rounded-2xl">
                    <div className="mb-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
                            <div>
                                <p>{user.name}</p>
                                <p className="text-gray-700 text-sm">{formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ar })}</p> {/* Formatted "time ago" */}
                            </div>
                        </div>
                        {(userLog?.uid === post.userId || userLog?.email === "ishakbanfradje@gmail.com") && (
                            <DeleteIcon onClick={deletePost} className="text-red-500 cursor-pointer" fontSize="large" />
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <div>
                            <div className="flex items-center gap-2 text-red-600 p-2 font-bold text-lg">
                                <DoDisturbAltOutlinedIcon />
                                <span>{post.productb}</span>
                            </div>
                            <img src={post.imageb} alt="" className="w-full h-48 object-cover rounded-md" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-green-600 p-2 font-bold text-lg">
                                <CheckCircleOutlineOutlinedIcon />
                                <span>{post.producta}</span>
                            </div>
                            <img src={post.imagea} alt="" className="w-full h-48 object-cover rounded-md" />
                        </div>
                    </div>
                    <Reacting post={post} user={user} userLog={userLog} />
                </div>
            )}
        </>
    );
}
