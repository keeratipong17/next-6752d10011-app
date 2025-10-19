"use client";

import Image from "next/image";
import Logo from "../../assets/images/training.png";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type TaskRow = {
  id: string;
  created_at: string;
  run_date: string;
  run_distance: number;
  run_place: string;
  run_image_url: string | null;
};

export default function Page() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("myrun_tb")
        .select(
          "id, created_at, run_date, run_distance, run_place, run_image_url"
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("SUPABASE SELECT ERROR:", error);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่");
      } else {
        console.log("SUPABASE DATA:", data);
        setTasks((data ?? []) as TaskRow[]);
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleDeleteClick = async (id: string) => {
    if (!confirm("คุณแน่ใจว่าจะลบหรือไม่")) return;

    const { error } = await supabase.from("myrun_tb").delete().eq("id", id);

    if (error) {
      console.error("SUPABASE DELETE ERROR:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      return;
    }

    alert("ลบข้อมูลเรียบร้อย");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const fmtDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="mt-16"
          src={Logo}
          alt="Task"
          width={200}
          height={200}
        />
        <h1 className="mt-10 text-4xl font-bold text-blue-700">
          การวิ่งของฉัน
        </h1>
        <h2 className="mt-5 text-2xl text-gray-400">บริการจัดการงานที่ทำ</h2>

        <div className="w-10/12 mt-3 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-500 text-white text-center">
                <th className="py-3 pl-5 pr-3 rounded-l font-semibold">No.</th>
                <th className="py-3 px-3 font-semibold">วันที่วิ่ง</th>
                <th className="py-3 px-3 font-semibold">รูปที่วิ่ง</th>
                <th className="py-3 px-3 font-semibold">ระยะทางในการวิ่ง</th>
                <th className="py-3 px-3 font-semibold">สถานที่วิ่ง</th>
                <th className="py-3 pr-5 pl-3 rounded-r font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    className="border p-4 text-center text-gray-500"
                    colSpan={6}
                  >
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td
                    className="border p-4 text-center text-gray-500"
                    colSpan={6}
                  >
                    ยังไม่มีข้อมูลการวิ่ง
                  </td>
                </tr>
              ) : (
                tasks.map((task, idx) => (
                  <tr key={task.id}>
                    {/* ลำดับ */}
                    <td className="py-4 pl-5 pr-3 rounded-l-xl text-gray-700 font-medium text-center">
                      {idx + 1}
                    </td>

                    {/* วันที่วิ่ง */}
                    <td className="py-4 px-3 text-gray-700 text-center">
                      {new Date(task.run_date).toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>

                    {/* รูปที่วิ่ง */}
                    <td className="py-4 px-3">
                      {task.run_image_url ? (
                        <img
                          src={task.run_image_url}
                          alt={`run-${task.id}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-cover mx-auto rounded-full"
                        />
                      ) : (
                        <div className="text-gray-400">-</div>
                      )}
                    </td>

                    {/* ระยะทาง */}
                    <td className="py-4 px-3 text-gray-800 font-semibold text-center">
                      {task.run_distance}
                    </td>

                    {/* สถานที่วิ่ง */}
                    <td className="py-4 px-3 text-gray-700 text-center">
                      {task.run_place || "-"}
                    </td>

                    {/* ปุ่ม Action */}
                    <td className="py-4 pr-5 pl-3 rounded-r-xl text-center">
                      <Link
                        className="text-green-600 mr-5 hover:underline"
                        href={`/edit/${task.id}`}
                      >
                        แก้ไข
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(task.id)}
                        className="text-red-600 hover:underline"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>


        {/* ปุ่มไปหน้าเพิ่มข้อมูล */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/create-my-run"
            className="w-full bg-blue-500 text-white px-100 py-2
                               rounded hover:bg-blue-600"
          >
            เพิ่มข้อมูลการวิ่งของฉัน
          </Link>
        </div>
      </div>
    </>
  );
}
