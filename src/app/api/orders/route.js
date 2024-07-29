import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

// Membuat order
export async function POST(req) {
  try {
    // Ambil token dari header
    const token = req.headers.get("authorization");

    // Cek apakah token ada
    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    // Ambil semua data dari body request
    const { address, postal_code, payment_method, country, user_id, products } =
      await req.json();

    // Cek apakah user memasukan products
    if (products.length === 0) {
      return new NextResponse("Please add at least one product", {
        status: 400,
      });
    }

    const transaction = await db.$transaction(async (tx) => {
      // Iterasi melalui setiap produk dan memeriksa stok
      for (const product of products) {
        const existingProduct = await tx.product.findUnique({
          where: {
            id: product.id,
          },
        });

        if (!existingProduct) {
          const error = new Error("Product not found");
          error.status = 404;
          throw error;
        }

        if (!existingProduct.colors.includes(product.color)) {
          const error = new Error(
            "Color what you want is not available on this product",
          );
          error.status = 400;
          throw error;
        }

        // Periksa apakah stok yang diminta melebihi stok yang tersedia
        if (existingProduct.stock < product.quantity) {
          const error = new Error(
            `Stock is not sufficient for product: ${existingProduct.name}`,
          );
          error.status = 400;
          throw error;
        }
      }

      // Jika stok mencukupi, buat pesanan
      const order = await tx.order.create({
        data: {
          address,
          postal_code,
          payment_method,
          country,
          user_id,
        },
      });

      // Buat entri pesanan untuk setiap produk
      const orderItems = await tx.orderItems.createMany({
        data: products.map((product) => ({
          order_id: order.id,
          product_id: product.id,
          quantity: product.quantity,
          color: product.color,
        })),
      });

      // Kurangi stok dari setiap produk yang dipesan
      for (const product of products) {
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: {
              decrement: product.quantity,
            },
          },
        });
      }
    });

    // Transaksi selesai tanpa error, pesanan berhasil dibuat
    return new NextResponse("Create order successfully", { status: 201 });
  } catch (err) {
    console.log(err);
    if (err instanceof JsonWebTokenError) {
      return new NextResponse("Unauthorized", { status: 401 });
    } else if (err.status === 404 || err.status === 400) {
      return new NextResponse(err.message, { status: err.status });
    } else {
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    const user = await db.user.findFirst({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await db.order.findMany({
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
        user: user.role === "ADMIN" ? true : false,
      },
      orderBy: {
        created_at: "asc",
      },
      where:
        user.role === "ADMIN"
          ? {}
          : {
              user_id: decoded.id,
            },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.log(err);
    if (err instanceof JsonWebTokenError) {
      return new NextResponse("Unauthorized", { status: 401 });
    } else {
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }
}
