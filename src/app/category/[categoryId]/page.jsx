import Form from "/src/app/category/_components/form";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { db } from "/src/lib/db.js"
import { redirect } from "next/navigation";

export default async function updateCategory({ params }) {
    const category = await db.category.findFirst({
        where: {
            id: params.categoryId,
        }
    });

    if (!category) {
        redirect("/category");
    };

    return (
        <DefaultLayout>
            <Form data={category} />
        </DefaultLayout>
    )
}