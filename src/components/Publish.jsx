/* eslint-disable react/prop-types */
import { useState } from "react";
import categories from "../constants/categories";
import supabase from '../lib/supabase';
import { storage } from "../lib/firebase";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

export default function Publish({ user }) {
  const [producta, setProducta] = useState("");
  const [productb, setProductb] = useState("");
  const [imagea, setImagea] = useState(null);
  const [imageb, setImageb] = useState(null);
  const [category, setCategory] = useState("");
  const [imgPerca, setImgPerca] = useState(false);
  const [imgPercb, setImgPercb] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadFile = (file, setImg, setPerc) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setPerc(true)

    uploadTask.on(
      "state_changed",
      (snapshot) => {

        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      // eslint-disable-next-line no-unused-vars
      (error) => { },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImg(downloadURL)
          setPerc(false)
        });
      }
    );
  };

  const normalizeString = (str) => str.toLowerCase().replace(/\s+/g, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    if (!producta || !productb || !imagea || !imageb || !category) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'جميع الحقول مطلوبة',
      });
      setLoading(false);
      return
    }
    const normalizedProducta = normalizeString(producta);
    const normalizedProductb = normalizeString(productb);

    const { data: existingData, error: checkError } = await supabase
      .from('boycott')
      .select('*');

    if (checkError) {
      console.error('Error checking data:', checkError);
      setLoading(false);
      return;
    }

    const isDuplicate = existingData.some(item =>
      normalizeString(item.producta) === normalizedProducta &&
      normalizeString(item.productb) === normalizedProductb
    );

    if (isDuplicate) {
      Swal.fire({
        icon: 'error',
        title: 'عذراً',
        text: 'المقاطعة موجودة بالفعل في القائمة, الرجاء تغيير أحد المنتجين ليتم النشر',
      });
      setLoading(false);
      return;
    }

    // eslint-disable-next-line no-unused-vars
    const { data, error } = await supabase
      .from('boycott')
      .insert([
        { producta, productb, imagea, imageb, category, userId: user.uid }
      ]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      Swal.fire({
        icon: 'success',
        title: 'تم نشر المقاطعة بنجاح',
        text: 'تمت إضافة المنتج بنجاح إلى القائمة',
      });
      setCategory("")
      setProducta("")
      setProductb("")
      setImagea("")
      setImageb("")
    }
    setLoading(false)
  };

  return (
    <div className="flex items-center justify-center w-full h-full py-4">
      <Helmet>
        <title>
          نشر مقاطعة | لنقاطع
        </title>
      </Helmet>
      <form className="bg-white md:w-9/12 shadow-lg rounded-lg p-4 space-y-4" onSubmit={handleSubmit}>
        <h1 className="text-center text-2xl font-bold">نشر مقاطعة</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <input
              type="text"
              className="bg-gray-100 p-2 rounded-lg border-2 border-gray-300 mb-4 w-full"
              placeholder="إسم المنتج المقاطع"
              value={productb}
              onChange={(e) => setProductb(e.target.value)}
            />
            <input type="file" id="img1" className="hidden" onChange={(e) => uploadFile(e.target.files[0], setImageb, setImgPercb)} />
            <label
              htmlFor="img1"
              className="border-dashed border-2 border-gray-300 w-full cursor-pointer h-40 flex items-center justify-center rounded-lg text-center font-bold"
            >
              {
                imgPercb ? 'جاري التحميل ...' : imageb ? <img src={imageb} alt="" className="w-full h-full object-cover" /> : "تحميل صورة المنتج المقاطع"
              }
            </label>
          </div>
          <div>
            <input
              type="text"
              className="bg-gray-100 p-2 rounded-lg border-2 border-gray-300 mb-4 w-full"
              placeholder="إسم المنتج البديل"
              value={producta}
              onChange={(e) => setProducta(e.target.value)}
            />
            <input type="file" id="img2" className="hidden" onChange={(e) => uploadFile(e.target.files[0], setImagea, setImgPerca)} />
            <label
              htmlFor="img2"
              className="border-dashed border-2 border-gray-300 w-full h-40 flex items-center justify-center cursor-pointer rounded-lg text-center font-bold"
            >
              {imgPerca ? 'جاري التحميل ...' : imagea ? <img src={imagea} alt="" className="w-full h-full object-cover" /> : "تحميل صورة المنتج البديل"}
            </label>
          </div>
        </div>
        <select
          name=""
          id=""
          className="bg-gray-100 mt-4 rounded-lg p-2 w-1/2 border-2 border-gray-300 text-lg"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled selected={!category}>نوع المنتج</option>
          {categories.map((c, i) => (
            <option value={c} key={i}>{c}</option>
          ))}
        </select>
        <button type="submit" className={`w-full p-2 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black text-white"} rounded-lg text-xl font-bold`}>
          {loading ? "جاري النشر ..." : "نشر"}
        </button>
      </form>
    </div>
  );
}