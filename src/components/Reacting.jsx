/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';

import supabase from '../lib/supabase';
import Swal from 'sweetalert2';

export default function Reacting({ post, userLog }) {
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [shares, setShares] = useState(0);

    useEffect(() => {
        setLikes(post.likes || []);
        setDislikes(post.dislikes || []);
        setShares(post.shares || 0);
    }, [post]);

    const handleLike = async () => {
        if (!userLog) {
            Swal.fire({
                icon: 'warning',
                title: 'يجب تسجيل الدخول',
                text: 'يرجى تسجيل الدخول لتتمكن من التفاعل مع المنشور',
            });
            return;
        }

        let updatedLikes = [];
        let updatedDislikes = dislikes.filter(id => id !== userLog?.uid);

        if (likes.includes(userLog?.uid)) {
            updatedLikes = likes.filter(id => id !== userLog?.uid);
        } else {
            updatedLikes = [...likes, userLog?.uid];
        }

        const { error } = await supabase
            .from('boycott')
            .update({ likes: updatedLikes, dislikes: updatedDislikes })
            .eq('id', post.id);

        if (!error) {
            setLikes(updatedLikes);
            setDislikes(updatedDislikes);
        }
    };

    const handleDislike = async () => {
        if (!userLog) {
            Swal.fire({
                icon: 'warning',
                title: 'يجب تسجيل الدخول',
                text: 'يرجى تسجيل الدخول لتتمكن من التفاعل مع المنشور',
            });
            return;
        }

        let updatedDislikes = [];
        let updatedLikes = likes.filter(id => id !== userLog?.uid);

        if (dislikes.includes(userLog?.uid)) {
            updatedDislikes = dislikes.filter(id => id !== userLog?.uid);
        } else {
            updatedDislikes = [...dislikes, userLog?.uid];
        }

        const { error } = await supabase
            .from('boycott')
            .update({ dislikes: updatedDislikes, likes: updatedLikes })
            .eq('id', post.id);

        if (!error) {
            setDislikes(updatedDislikes);
            setLikes(updatedLikes);
        }
    };

    const handleShare = async () => {
        const updatedShares = shares + 1;
        const { error } = await supabase
            .from('boycott')
            .update({ shares: updatedShares })
            .eq('id', post.id);

        if (!error) setShares(updatedShares);

        // Share logic here, for example:
        const shareData = {
            title: 'منشور مقاطعة منتج',
            // text: 'Check out this post!',
            
            url: window.location.origin + '/post/' + post.id,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard if share is not supported
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('URL copied to clipboard');
            } catch (error) {
                console.error('Error copying URL:', error);
            }
        }
    };

    return (
        <div>
            <p className='text-gray-800 text-sm mb-2 flex items-center gap-2'>
                <span>{likes.length} مقاطع,</span>
                <span>{dislikes.length} منتج غير مقاطع,</span>
                <span>{shares} مشاركة</span>
            </p>
            <div className='grid grid-cols-3'>
                <div
                    className={`flex items-center justify-center border-[1px] p-2 gap-2 cursor-pointer ${likes.includes(userLog?.uid) ? 'text-green-600' : 'text-gray-700'}`}
                    onClick={handleLike}
                >
                    {likes.includes(userLog?.uid) ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
                    <span>أنا مقاطع</span>
                </div>
                <div
                    className={`flex items-center justify-center border-[1px] p-2 gap-2 cursor-pointer ${dislikes.includes(userLog?.uid) ? 'text-red-600' : 'text-gray-700'}`}
                    onClick={handleDislike}
                >
                    {dislikes.includes(userLog?.uid) ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />}
                    <span>المنتج غير مقاطع !</span>
                </div>
                <div
                    className="flex items-center justify-center border-[1px] p-2 gap-2 cursor-pointer text-gray-700"
                    onClick={handleShare}
                >
                    <ShareIcon />
                    <span>مشاركة</span>
                </div>
            </div>
        </div>
    );
}