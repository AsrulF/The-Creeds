import Form from "/src/app/product/_components/form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "/src/lib/db.js";
import { redirect } from "next/navigation";

export default async function updateProduct({ params }) {
    const product = await db.product.findFirst({
        where: {
            id: params.productId,
        },
    });

    const categories = await db.category.findMany();

    if (!product) {
        redirect("/product");
    };

    return (
        <DefaultLayout>
            <Form products={product} categories={categories} />
        </DefaultLayout>
    )
}