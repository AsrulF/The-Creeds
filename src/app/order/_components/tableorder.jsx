"use client";
import Image from "next/image";

export default function TableOrder({ orderItems, ordersData }) {
  let total = 0;

  for (const item of orderItems) {
    const totalQuantity = item.product.price * item.quantity;
    total += totalQuantity;
  }

  return (
    <div className="overflow-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex items-center justify-between px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {ordersData.user.name} Orders Detail
        </h4>
      </div>
      <div className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center justify-center">
          <p className="font-medium">Products</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Color</p>
        </div>
        <div className="col-span-1 flex items-center justify-center">
          <p className="font-medium">Quantity</p>
        </div>
        <div className="col-span-2 flex items-center justify-center">
          <p className="font-medium">Price</p>
        </div>
      </div>
      {orderItems.map((orderItem, key) => (
        <div
          key={key}
          className="grid grid-cols-5 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-7 md:px-6 2xl:px-7.5"
        >
          <div className="col-span-3 flex items-center justify-between gap-3">
            <div className="w-1/3 flex items-center justify-center">
              <Image
                src={`/api/images/${orderItem.product.images[0]}`}
                width={60}
                height={50}
                alt="Product"
              />
            </div>
            <div className="w-2/3">
              <p className="text-sm text-black dark:text-white">
                {orderItem.product.title}
              </p>
            </div>
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <div
              style={{
                backgroundColor: `${orderItem.color}`,
                height: 30,
                width: 30,
                borderRadius: 50,
              }}
            />
          </div>
          <div className="col-span-1 flex items-center justify-center">
            <p className="text-sm text-black dark:text-white">
              {orderItem.quantity}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-end">
            <p className="text-sm text-black dark:text-white">
              Rp{" "}
              {(orderItem.quantity * orderItem.product.price)
                .toLocaleString()
                .replaceAll(",", ".")}
            </p>
          </div>
        </div>
      ))}
      <div className="flex justify-between border-t border-stroke py-6 text-lg font-semibold text-black dark:text-white md:px-6 2xl:px-7.5">
        <p>Totals</p>
        <p>Rp {total.toLocaleString()}</p>
      </div>
    </div>
  );
}
