/* eslint-disable react/prop-types */
import logo from "../assets/logo11.png";
import google from "../assets/google.png";

import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../lib/firebase";
import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import PublishIcon from '@mui/icons-material/Publish';
import HomeIcon from '@mui/icons-material/Home';
import isSure from "../lib/swal";
import supabase from "../lib/supabase";

import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import InstagramIcon from '@mui/icons-material/Instagram';

// import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Sidebar({ user, setUser }) {
  // const navigate = useNavigate();

  // const signInWithGoogle = async () => {
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       localStorage.setItem("user", JSON.stringify(result.user));
  //       setUser(result.user);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };



  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      // Save user info in localStorage
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      // Check if user exists in Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.uid)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // If user doesn't exist, insert into Supabase
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: user.uid,
              name: user.displayName,
              image: user.photoURL,
              email: user.email,
            },
          ]);

        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };


  const logout = async () => {
    const confirmed = await isSure("هل تريد فعلا تسجيل الخروج ؟");
    if (confirmed) {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <div className="bg-image relative md:pb-0 pb-6">
      <div className="absolute bg-green-700/85 w-full h-full"></div>
      <div className="relative">
        <img src={logo} alt="" className="invert w-2/3 mx-auto" />
        <h1 className="text-white text-xl text-center">
          السلام عليكم و مرحبا بكم في موقع{" "}
          <span className="text-red-500 font-bold">لنقاطع</span>
        </h1>
        <ul className="text-white px-4 mt-6">
          <p className="mb-4">
            قم بنشر المنتج المقاطع مع البديل ولكن قبل ذلك تأكد أن:{" "}
          </p>
          <li className="list-disc mr-6">المنتج فعلا مقاطع</li>
          <li className="list-disc mr-6">
            المنتج مع البديل غير منشورين معا من قبل
          </li>
        </ul>
        {!user && (
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-3 bg-white w-10/12 mx-auto mt-6 rounded-md py-2 text-xl font-bold"
          >
            <img src={google} alt="" className="w-8" />
            <span>تسجيل الدخول بجوجل</span>
          </button>
        )}
        {user && (
          <div className="w-10/12 mx-auto mt-6">
            <div className="flex items-center gap-3 rounded-full bg-white">
              <img src={user.photoURL} alt="" className="rounded-full w-12 h-12" />
              <h1 className="font-bold text-lg">{user.displayName}</h1>
            </div>
          </div>
        )}
        <div className="mt-4 bg-white w-10/12  mx-auto">
          <Link to={'/'} className="underline text-xl p-2 flex items-center gap-2 justify-center">
            <HomeIcon />
            <span>الرئيسية</span>
          </Link>
          {
            user && <>
              <Link to={'/publish'} className="underline text-xl p-2 bg-gray-100 flex items-center gap-2 justify-center">
                <PublishIcon />
                <span>نشر مقاطعة</span>
              </Link>
              <button onClick={logout} className="text-red-600 text-xl p-2 flex items-center gap-2 justify-center w-full">
                <LogoutIcon />
                <span>تسجيل الخروج</span>
              </button>
            </>
          }
        </div>
        <div className="flex items-center justify-center gap-2 text-xl text-white mt-4" style={{ direction: "ltr" }}>
          <p>@ishak_benfredj</p>
          <Link to={'https://ishakbenfredj.netlify.app/'} target="_blank"><LanguageIcon /></Link>
          <Link to={'https://facebook.com/profile.php?id=100012679398775'} target="_blank"><FacebookIcon /></Link>
          <Link to={'https://facebook.com/IshakBenfredjdevloper'} target="_blank"><AssistantPhotoIcon /></Link>
          <Link to={'https://instagram.com/ishak_benfredj/'} target="_blank"><InstagramIcon /></Link>
        </div>
      </div>
    </div>
  );
}
