import Form from "/src/app/user/_components/form";
import Breadcrumb from "/src/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "/src/components/Layouts/DefaultLayout";
import { db } from "/src/lib/db.js";

export default async function CreateUserPage() {
    const userRoles = await db.roleUser.findMany({

    });

        console.log(userRoles)

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Create User" />
            <Form roles={userRoles}/>
        </DefaultLayout>
    )
}