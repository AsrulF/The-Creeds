import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableDetail from "../_components/tableorder";

export default async function detailOrder({ params }) {
  const ordersData = await db.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    },
  });

  const orderItems = await db.orderItems.findMany({
    where: {
      order_id: params.orderId,
    },
    include: {
      product: true,
    },
  });

  // console.log(ordersData)

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Orders Items" />
      <TableDetail orderItems={orderItems} ordersData={ordersData} />
    </DefaultLayout>
  );
}
