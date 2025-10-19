"use client";

import Image from "next/image";
import Task from "../../assets/images/training.png";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";


type tasks = {
  id: string;
  created_at: string; // เดิมสะกด create_at -> ให้ตรงกับ select
  run_date: string;
  run_distance: boolean;
  run_place: string;
  run_image_url : string;
};

export default function Page() {
  const [tasks, setTasks] = useState<tasks[]>([]); // ใช้ type เดียวกับที่ประกาศ

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from("myrun_tb")
        .select(
          "id, created_at, run_date, run_distance, run_place, run_image_url"
        )
        .order("created_at", { ascending: false });

      if (error) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่");
        console.error(error.message);
        return;
      }
      if (data) {
        setTasks(data as tasks[]);
      }
    };
    fetchTasks();
  }, []);

  const handleDeletClick = async (id: string) => {
    if (confirm("คุณแน่ใจว่าจะลบหรือไม่")) {
      const { data, error } = await supabase
        .from("myrun_tb")
        .delete()
        .eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
        console.log(error.message);
        return;
      }

      alert("ลบข้อมูลเรียบร้อย");
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="mt-16"
          src={Task}
          alt="Task"
          width={200}
          height={200}
        />
        <h1 className="mt-10 text-4xl font-bold text-blue-700">
          การวิ่งของฉัน
        </h1>
        <h1 className="mt-5 text-2xl text-gray-400">บริการจัดการงานที่ทำ</h1>
        <div className="flex w-10/12 justify-end">
          <Link
            className="mt-5 text-white bg-sky-400 px-8 py-2 rounded hover:bg-sky-300"
            href={"/addtask"}
          >
            เพิ่มงาน
          </Link>
        </div>
        <div className="w-10/12 flex mt-5 ">
          <table className="w-full">
            <thead>
              <tr className="text-center font-bold bg-gray-300">
                <td className="border p-2">No.</td>
                <td className="border p-2">วันที่วิ่ง</td>
                <td className="border p-2">รูปที่วิ่ง</td>
                <td className="border p-2">ระยะทางในการวิ่ง</td>
                <td className="border p-2">สภานที่วิ่ง</td>
                <td className="border p-2">วันที่แก้ไข</td>
                <td className="border p-2">Action</td>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border p-2">{task.id}</td>
                  <td className="border p-2">{task.run_date}</td>
                  <td className="border p-2 text-center">
                    {task.run_image_url ? (
                      <Image
                        className="mx-auto"
                        src={task.run_image_url}
                        alt={task.run_date}
                        width={50}
                        height={50}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="border p-2">{task.run_distance}</td>
                  <td className="border p-2">{task.run_place}</td>
                  
                  <td className="border p-2">
                    <Link
                      className="text-green-500 mr-5 hover:bg-green-600"
                      href={""}
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDeletClick(task.id)}
                      className="text-red-500 cursor-pointer hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </>
  );
}
