"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import task from "./../../assets/images/training.png";

export default function Page() {
  // ฟิลด์ข้อมูลการวิ่ง
  const [run_date, setRunDate] = useState("");
  const [run_distance, setRunDistance] = useState<number | "">("");
  const [run_place, setRunPlace] = useState("");

  // รูปภาพ
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // พรีวิวรูป (ในหน่วยความจำ)
  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : ""),
    [imageFile]
  );

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleUploadAndSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // ตรวจสอบข้อมูล
    if (!run_date || run_distance === "" || !run_place) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setSaving(true);
    let imageUrl: string | null = null;

    try {
      // 0) debug คร่าว ๆ
      if (imageFile) {
        console.log("UPLOAD DEBUG:", {
          bucket: "test_bk",
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size,
        });
      }

      // 1) อัปโหลดรูป (ถ้ามี)
      if (imageFile) {
        const ext = (imageFile.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${Date.now()}.${ext}`; // เก็บที่ root ของ test_bk

        const { error: upErr } = await supabase.storage
          .from("test_bk")
          .upload(path, imageFile, {
            cacheControl: "3600",
            upsert: true,
            contentType: imageFile.type || "image/*",
          });

        if (upErr) {
          console.error("UPLOAD ERROR:", upErr);
          alert(`เกิดข้อผิดพลาดในการอัปโหลดรูป: ${upErr.message}`);
          setSaving(false);
          return;
        }

        // เก็บ "ชื่อไฟล์" (path) ลงฐานข้อมูล
        imageUrl = path;
      }

      // 2) บันทึก DB
      const { error: insErr } = await supabase.from("myrun_tb").insert({
        run_date, // YYYY-MM-DD
        run_distance: Number(run_distance),
        run_place,
        run_image_url: imageUrl,
      });

      if (insErr) {
        console.error("INSERT ERROR:", {
          message: insErr.message,
          details: insErr.details,
          hint: insErr.hint,
          code: insErr.code,
        });
        alert(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${insErr.message}`);
        setSaving(false);
        return;
      }

      alert("บันทึกข้อมูลเรียบร้อย");
      router.push("/show-all-myrun");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center pb-30">
        {/* ส่วนบน */}
        <Image className="mt-20" src={task} alt="Task" width={120} />
        <h1 className="mt-8 text-2xl font-bold text-blue-700">
          เพิ่มข้อมูลการวิ่งของฉัน
        </h1>

        {/* ฟอร์ม */}
        <div className="w-full max-w-2xl p-6 mx-auto rounded-xl mt-5 bg-white shadow">
          <form onSubmit={handleUploadAndSave} className="w-full space-y-5">
            {/* ป้อนวันวิ่ง */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">
                ป้อนวันวิ่ง
              </label>
              <input
                type="date"
                value={run_date}
                onChange={(e) => setRunDate(e.target.value)}
                className="w-full border border-gray-300 rounded-none p-2
                 focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            {/* ระยะทางที่วิ่ง */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">
                ระยะทางที่วิ่ง (กม.)
              </label>
              <input
                value={run_distance}
                onChange={(e) => setRunDistance(e.target.valueAsNumber || "")}
                type="number"
                step="any"
                placeholder="ระยะทางที่วิ่ง"
                className="w-full border border-gray-300 rounded-none p-2
                           placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-sky-400 focus:border-sky-400"
                required
              />
            </div>

            {/* สถานที่วิ่ง */}
            <div>
              <label className="block mb-1 text-sm text-gray-700">
                สถานที่วิ่ง
              </label>
              <input
                value={run_place}
                onChange={(e) => setRunPlace(e.target.value)}
                type="text"
                placeholder="สถานที่วิ่ง"
                className="w-full border border-gray-300 rounded-none p-2
                           placeholder-gray-400 focus:outline-none focus:ring-2
                           focus:ring-sky-400 focus:border-sky-400"
                required
              />
            </div>
            {/* พรีวิวรูป */}
            <div className="flex flex-col items-center">
              <div className="h-32 w-32  bg-gray-100 ring-1 ring-gray-200 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">รูปภาพ</span>
                )}
              </div>

              {/* label ทำหน้าที่เป็นปุ่ม */}
              <label
                htmlFor="fileUpload"
                className="mt-3 inline-block bg-green-600 text-white px-5 py-2 rounded-lg cursor-pointer hover:bg-green-500 transition"
              >
                SELECT FLIE UPLOAD
              </label>

              {/* input ถูกซ่อนไว้ */}
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                onChange={handleSelectImage}
                className="hidden"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded
                           hover:bg-blue-600 disabled:opacity-60"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกการวิ่ง"}
              </button>
            </div>
          </form>

          <Link
            href="/show-all-myrun"
            className="text-blue-500 w-full text-center mt-5 block hover:text-blue-600"
          >
            กลับไปหน้าแสดงรายการวิ่ง
          </Link>
        </div>
      </div>
    </>
  );
}
