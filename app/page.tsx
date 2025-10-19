import Image from "next/image";
import Task from "../assets/images/training.png";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center">
        <Image
          className="mt-15"
          src={Task}
          alt="Task"
          width={200}
          height={200}
        />
        <h1 className="mt-10 text-4xl font-bold text-black-700">
          Welcome to MyRun
        </h1>
        <br/>

        <h1 >Your personal running record</h1>
        <br/>

        <h1 >You can create and update your running record</h1>
        <Link
          href="/alltask"
          className="bg-blue-700  mt-10 px-15 py-2 rounded text-white rounded
          hover:bg-blue-400"
        >
          เข้าสู่หน้าข้อมูลการวิ่งของฉัน
        </Link>
      </div>
      
    </>
  );
}
