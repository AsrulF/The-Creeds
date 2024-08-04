"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Form({ categories, products }) {
  const token = Cookies.get("currentUser");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState(
    products
      ? products
      : {
          title: "",
          price: 0,
          description: "",
          category_id: "",
          company: "",
          stock: 0,
          shipping: false,
          featured: false,
          colors: ["#000"],
          images: [],
        },
  );

  function handleOnChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.images.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select images",
      });
      return;
    }

    setIsLoading(true);

    const headers = {
      Authorization: token,
    };

    try {
      if (products) {
        const response = await axios.patch(
          `/api/products/${data.id}`,
          {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          },
          {
            headers,
          },
        );
      } else {
        const response = await axios.post(
          `/api/products`,
          {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            shipping: JSON.parse(form.shipping),
          },
          {
            headers,
          },
        );
      }

      router.push("/product");
      router.refresh();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleImages(e) {
    setIsLoading(true);
    const files = Array.from(e.target.files);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const { data } = await axios.post("/api/images", formData, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        ...form,
        images: [...form.images, ...data.images],
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteImage(filename, index) {
    setIsLoading(true);

    try {
      await axios.delete(`/api/images/${filename}`);

      const updatedPreviews = [...form.images];
      updatedPreviews.splice(index, 1);
      setForm({
        ...form,
        images: updatedPreviews,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleOnChangeColor(e, i) {
    const newColors = [...form.colors];
    newColors[i] = e.target.value;
    setForm({
      ...form,
      colors: newColors,
    });
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="flex flex-col gap-9">
        {/* <!-- Contact Form --> */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              Contact Form
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6.5">
              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Title
                  </label>
                  <input
                    required
                    type="text"
                    name="title"
                    onChange={handleOnChange}
                    value={form.title}
                    placeholder="Title"
                    disabled={isLoading}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Price
                  </label>
                  <input
                    required
                    disabled={isLoading}
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleOnChange}
                    placeholder="Rp. 0"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Stock
                  </label>
                  <input
                    required
                    disabled={isLoading}
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleOnChange}
                    placeholder="0"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>

                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Company
                  </label>
                  <input
                    required
                    disabled={isLoading}
                    type="text"
                    placeholder="Company"
                    name="company"
                    value={form.company}
                    onChange={handleOnChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Category
                </label>
                <select
                  required
                  disabled={isLoading}
                  value={form.category_id}
                  name="category_id"
                  onChange={handleOnChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option
                    value=""
                    selected
                    className="text-body dark:text-bodydark"
                  >
                    Select Category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="text-body dark:text-bodydark"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div className="w-full xl:w-1/2">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Shipping
                  </label>
                  <select
                    required
                    name="shipping"
                    value={form.shipping}
                    onChange={handleOnChange}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    <option
                      value={true}
                      className="text-body dark:text-bodydark"
                    >
                      Yes
                    </option>
                    <option
                      value={false}
                      className="text-body dark:text-bodydark"
                    >
                      No
                    </option>
                  </select>
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Colors
                </label>
                <div className="flex items-center gap-x-3">
                  {form.colors.map((color, index) => (
                    <input
                      required
                      disabled={isLoading}
                      key={index}
                      type="color"
                      value={color}
                      onChange={(e) => handleOnChangeColor(e, index)}
                      className="cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    />
                  ))}
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        colors: [...prev.colors, "#000"],
                      }))
                    }
                    className="rounded bg-primary px-3 py-1 font-medium text-white hover:bg-opacity-90"
                  >
                    Add
                  </button>
                  {form.colors.length > 1 && (
                    <button
                      disabled={isLoading}
                      onClick={() => {
                        if (form.colors.length !== 1) {
                          setForm({
                            ...form,
                            colors: [...form.colors].slice(
                              0,
                              form.colors.length - 1,
                            ),
                          });
                        }
                      }}
                      className="rounded bg-danger px-3 py-1 font-medium text-white hover:bg-opacity-90"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4.5">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Images
                </label>
                <input
                  disabled={isLoading}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImages}
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>

              <div className="mb-6">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  disabled={isLoading}
                  rows={6}
                  name="description"
                  value={form.description}
                  onChange={handleOnChange}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                ></textarea>
              </div>

              <button
                disabled={isLoading}
                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
              >
                {products ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="grid h-fit grid-cols-2 gap-5">
        {form.images.map((image, i) => (
          <div key={i} className="relative aspect-square rounded-md bg-white">
            <Image
              fill
              src={`${process.env.NEXT_PUBLIC_API_URL_IMG}/${image}`}
              alt="Preview"
              className="rounded-md object-cover"
            />
            <button
              onClick={() => handleDeleteImage(image, i)}
              className="absolute right-[-10px] top-[-10px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-red text-white transition-all duration-150 hover:bg-opacity-90"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
