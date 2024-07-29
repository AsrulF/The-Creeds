import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

// Get order by id and include order_items in order and include product in order_items
export async function GET(req, { params }) {
    try {
        // Verify token
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
        
        const user = await db.user.findFirst({
            where: {
                id: decoded.id
            },
            include: {
                role: true
            }
        });
        // Get order id
        const order = await db.order.findFirst(
            {
                where: user.role.rolename === "ADMIN" ? {
                    id: params.orderId,
                } : {
                    id: params.orderId,
                    user_id: decoded.id,
                },
                include: {
                    order_items: {
                        include: {
                            product: true,
                        }
                    }
                } 
            },
        );

        // Check if order found
        if (!order) {
            return new NextResponse("Order not found", { status: 404 })
        };

        // Get order items

        return NextResponse.json(
            {
                data: order,
                success: true,
                message: "Search order by ID done"
            }
        )
    } catch (err) {
        console.log(err);
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Invalid token", { status: 401 });
        } else {
            return new NextResponse("Internal server error", { status: 500 });
        }
    }
}


// Delete order by id
export async function DELETE(req, { params }) {
    try {
        // Token
        const token = req.headers.get("authorization");

        if (!token) {
            return new NextResponse("Unauthorized", { status: 404 })
        };

        const decode = jwt.verify(token, process.env.JWT_ACCESS_KEY);

        const user = await db.user.findFirst(
            {
                where: {
                    id: decode.id,
                }
            }
        );

        // Get order by id
        const { orderId } = params;
        const order = await db.order.findFirst(
            {
                where: {
                    id: orderId,
                },
            },
        ) ;

        // Check if order found
        if (!order) {
            return new NextResponse("Order not found", { status: 404 })
        };

        // Delete order
        await db.order.delete(
            {
                where: user.role === "ADMIN" ? {
                    id: orderId,
                } : {
                    id: orderId,
                    user_id: decode.id,
                },
            },
        );

        // Return deleted order
        return NextResponse.json(
            {
                data: null,
                success: true,
                message: "Order deleted successfully"
            }
        );
    } catch (err) {
        console.log(err);
        if (err instanceof JsonWebTokenError) {
            return new NextResponse("Unauthorized", { status: 401})
        } else {
            return new NextResponse("Internal server error", { status: err.status })
        }
    };
}
