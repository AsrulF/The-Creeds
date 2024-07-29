"use client";

import axios from "axios";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Form({ roles }) {
    const token = Cookies.get("currentUser");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role_id: ""
    });

    function handleOnChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setIsLoading(true);

        const headers = {
            Authorization: token,
        };

        try {
            const response = await axios.post(
                `/api/auth/sign-up`,
                {
                    ...form,
                },
                {
                    headers,
                }
            );

            router.push("/user");
            router.refresh();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
            });
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="grid md:grid-cols-2">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">New User</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
                <div className="flex items-center gap-10">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white w-1/3">
                        Name
                    </label>
                    <input 
                       required
                       type="text"
                       name="name"
                       onChange={handleOnChange}
                       value={form.name}
                       disabled={isLoading}
                       placeholder="User Name"
                       className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-10">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white w-1/3">
                        Email
                    </label>
                    <input 
                       required
                       name="email"
                       type="email"
                       onChange={handleOnChange}
                       value={form.email}
                       disabled={isLoading}
                       placeholder="User Mail"
                       className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-10">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white w-1/3">
                        Password
                    </label>
                    <input 
                       required
                       name="password"
                       type="text"
                       onChange={handleOnChange}
                       value={form.password}
                       disabled={isLoading}
                       placeholder="User Password"
                       className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="flex items-center gap-10">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white w-1/3">
                        Role
                    </label>
                    <select
                       required
                       onChange={handleOnChange}
                       value={form.role_id}
                       name="role_id"
                       disabled={isLoading}
                       className="w-2/3 rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option
                          value=""
                          selected
                          className="text-body dark:text-bodydark"
                        >
                            Select Role
                        </option>
                        {roles.map((role) => (
                            <option
                              key={role.id}
                              value={role.id}
                              className="text-body dark:text-bodydark"
                            >
                                {role.rolename}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center justify-end">
                    <button
                       type="submit"
                       className="flex w-1/3 justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                        Create User
                    </button>
                </div>
            </form>
        </div>
    </div>
  )

}