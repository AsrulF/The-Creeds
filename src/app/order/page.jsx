import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/lib/db";
import Table from "@/app/order/_components/table";

export const metadata = {
    title:
      "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
  };

export default async function OrderPage() {
    const orders = await db.order.findMany({
        include: {
            user: true,
        },
        orderBy: {
            created_at: "asc"
        }
    });


    // console.log(orders)

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Order" />
            <Table orders={orders} />
        </DefaultLayout>
    );
}