import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "@/lib/db";
import Table from "@/app/product/_components/table";

export const metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default async function ProductPage() {
  const products = await db.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      category : {
        name: "asc"
      }
    }
  });

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Product" />
      <Table products={products} />
    </DefaultLayout>
  );
}
