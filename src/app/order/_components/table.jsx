"use client";

import axios from "axios";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function Table({ orders }) {
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const router = useRouter();
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrder([]);
    } else {
      setSelectedOrder(orders.map((order) => order.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleSelectOrder = (id) => {
    setIsAllSelected(false);
    setSelectedOrder(
      selectedOrder.includes(id)
        ? selectedOrder.filter((orderId) => orderId !== id)
        : [...selectedOrder, id],
    );
  };

  const handleBulkDelete = async () => {
    try {
      const confirm = await Swal.fire({
        title: "Delete order ?",
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Yes",
        icon: "question",
        denyButtonText: "No"
      });

      if (confirm.isConfirmed) {
        await axios.post("/api/orders/bulk/delete", {
          ids: selectedOrder,
        });

        setSelectedOrder([]);
        setIsAllSelected(false);

        Swal.fire({
          title: "Success",
          text: "Orders Deleted Succesfully",
          icon: "success",
        });
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Error",
        text: "Delete orders failed",
        icon: "error",
      });
    }
  };

  console.log("Selected order", selectedOrder);

  return (
    <div className="overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Orders History
        </h4>
        <button
          className="inline-block cursor-pointer rounded bg-red px-5 py-2 font-medium text-white transition-all hover:bg-opacity-90"
          onClick={handleBulkDelete}
        >
          Bulk Delete
        </button>
      </div>
      <div className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center justify-center">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
          />
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">User Name</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Addresss</p>
        </div>
        <div className="col-span-1 hidden items-center justify-center sm:flex">
          <p className="font-medium">Postal Code</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Payment</p>
        </div>
        <div className="col-span-1 hidden items-center justify-center sm:flex">
          <p className="font-medium">Country</p>
        </div>
        <div className="col-span-1 hidden items-center justify-center sm:flex">
          <p className="font-medium">Created At</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Action</p>
        </div>
      </div>
      { orders ? orders.map((order, key) => (
        <div
          className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedOrder.includes(order.id)}
              onChange={() => handleSelectOrder(order.id)}
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {order.user.name}
            </p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {order.address}
            </p>
          </div>
          <div className="col-span-1 hidden items-center justify-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {order.postal_code}
            </p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {order.payment_method}
            </p>
          </div>
          <div className="col-span-1 hidden items-center justify-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {order.country}
            </p>
          </div>
          <div className="col-span-1 hidden items-center justify-center sm:flex">
            <p className="text-sm text-black dark:text-white">
              {order.created_at.toDateString()}
            </p>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <Link href={`/order/${order.id}`} className="hover:text-primary">
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                  fill=""
                />
                <path
                  d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                  fill=""
                />
              </svg>
            </Link>
          </div>
        </div>
      )) : <p>Orders Not Found</p>}
    </div>
  );
}
