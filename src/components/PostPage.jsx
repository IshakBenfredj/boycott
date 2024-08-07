import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../lib/supabase";
import CircularProgress from '@mui/material/CircularProgress';
import Post from "./Post";
import { Helmet } from "react-helmet";

// eslint-disable-next-line react/prop-types
export default function PostPage({ user }) {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const { data: post, error } = await supabase
                    .from('boycott')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching post:', error);
                    setLoading(false);
                    return;
                }

                setPost(post);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching post:', error);
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center"><CircularProgress /></div>;
    }

    if (!post) {
        return <div className="flex items-center justify-center font-bold text-3xl md:h-screen w-full md:p-0 p-6">منشور غير موجود</div>;
    }

    return (
        <div className="md:min-h-screen py-4 flex items-center justify-center">
            <Helmet>
                <title>
                    مقاطعة {post.productb} واستبداله بـ {post.producta}
                </title>
            </Helmet>
            <div className="md:w-10/12">
                <Post post={post} userLog={user} />
            </div>
        </div>
    );
}
