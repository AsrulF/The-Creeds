import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "/src/lib/db.js";
import Table from "@/app/user/_components/table";

export const metadata = {
    title:
      "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
    description: "This is Next.js Home for TailAdmin Dashboard Template",
  };

export default async function UserPage() {
    const users = await db.user.findMany({
        include: {
            role: true
        },
        orderBy: {
            role: {
                rolename: "asc"
            }
        }
    });

    return (
        <DefaultLayout>
            <Breadcrumb pageName="User" />
            <Table users={users} />
        </DefaultLayout>
    )
}