"use client";

import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Form({ data }) {
  const router = useRouter();
  const [name, setName] = useState(data ? data.name : "");
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("currentUser");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `${token}`,
  };

  function handleChange(event) {
    setName(event.target.value);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (data) {
        await axios.patch(
          `/api/categories/${data.id}`,
          {
            name: name,
          },
          {
            headers: headers,
          }
        );
      } else { 
        await axios.post(
          `/api/categories`,
          {
            name,
          },
          {
            headers: headers,
          },
      )}

      router.push("/category");
      router.refresh();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err?.message || err,
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2">
      {/* <!-- Input Fields --> */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">Form</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
          <div>
            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
              Name
            </label>
            <input
              disabled={isLoading}
              type="text"
              value={name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            { data ? "Update" : "Submit" }
          </button>
        </form>
      </div>
    </div>
  );
}
