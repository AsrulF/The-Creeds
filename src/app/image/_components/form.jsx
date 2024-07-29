"use client";

import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

export default function Form() {
  const [images, setImages] = useState([]);

  // Fungsi copy or export excel
  const copyToClipboard = () => {
    if (images.length > 0) {
      if (images.length > 1) {
        let data = [
          ["Images"],
          ["filename1.png"],
          ["filename2.png"]
        ];

        const header = ["Image"];
        data.push(header);

        for (const image of images) {
          const row = [image];
          data.push(row);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Images");
        XLSX.writeFile(workbook, "images.xlsx");
      } else {
        navigator.clipboard
          .writeText(images)
          .then(() => {
            alert("Copied to clipboard: " + images);
          })
          .catch((err) => {
            console.error("Could not copy text: ", err);
          });
      }
    }
  };

  // Fungsi upload images
  const handleImage = async (e) => {
    try {
      const files = Array.from(e.target.files);
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await axios.post(`/api/images`, formData, {
        headers: {
          Authorization: Cookies.get("currentUser"),
          "Content-Type": "multipart/form-data",
        },
      });

      setImages(data.data);
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error",
        text: "Internal server error",
        icon: "error",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2">
      {/* <!-- Input Fields --> */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Form</h3>
        </div>
        <form className="flex flex-col gap-5.5 p-6.5">
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImage}
              className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
          </div>
          <div className="flex gap-3">
            {/* <input
              value={images}
              disabled
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            /> */}
            <div className="flex-1">
              {images.map((image, index) => (
                <p key={index}>{image}</p>
              ))}
            </div>
            {images.length > 0 &&
              (images.length === 1 ? (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="h-fit rounded bg-primary px-3 py-2 hover:bg-primary/90"
                >
                  <svg
                    className="fill-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#ffffff"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"
                      fill="#ffffff"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="flex h-fit items-center gap-2 rounded bg-primary px-3 py-2 text-white hover:bg-primary/90"
                >
                  Export
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V4H19V20ZM10.41 10.59L12 9L10.41 7.41L9 8.82L7.59 7.41L6 9L7.59 10.59L6 12L7.59 13.41L9 12L10.41 13.41L12 12L10.41 10.59ZM14 16H16V14H18V12H16V10H14V12H12V14H14V16Z"
                      fill="white"
                    />
                  </svg>
                </button>
              ))}
          </div>
        </form>
      </div>
    </div>
  );
}