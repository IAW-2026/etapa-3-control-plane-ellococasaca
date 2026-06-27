"use client";

import { useState } from "react";
import type { SellerProduct, SellerUser } from "@/lib/seller";
import DeleteButton from "./DeleteButton";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type Props = {
  products: SellerProduct[];
  sellers: SellerUser[];
};

export default function SellerPanel({ products, sellers }: Props) {
  const [productQuery, setProductQuery] = useState("");
  const [sellerQuery, setSellerQuery] = useState("");

  const filteredProducts = productQuery.trim()
    ? products.filter((p) =>
        p.id.toLowerCase().includes(productQuery.trim().toLowerCase())
      )
    : products;

  const filteredSellers = sellerQuery.trim()
    ? sellers.filter((s) =>
        s.id.toLowerCase().includes(sellerQuery.trim().toLowerCase())
      )
    : sellers;

  return (
    <div className="space-y-8">
      {/* Tabla de productos */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Productos</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por ID de producto…"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-3 py-1.5 w-56 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1 shrink-0">
              {filteredProducts.length} productos
            </span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[2fr_0.8fr_0.7fr_1.2fr_1fr_0.6fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
            <span>Producto</span>
            <span>Precio</span>
            <span>Stock</span>
            <span>Vendedor</span>
            <span>Categoría</span>
            <span className="text-right">Acción</span>
          </div>
          {filteredProducts.length === 0 ? (
            <p className="px-5 py-6 text-xs text-slate-400 text-center">
              Sin resultados para &ldquo;{productQuery}&rdquo;
            </p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[2fr_0.8fr_0.7fr_1.2fr_1fr_0.6fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
              >
                <div>
                  <p className="text-xs text-slate-700 font-medium truncate">{product.title}</p>
                  <p className="font-mono text-xs text-slate-400">{product.id}</p>
                  <p className="text-xs text-slate-400">{formatDate(product.createdAt)}</p>
                </div>
                <p className="text-xs text-slate-700">{formatARS(product.price)}</p>
                <p className={`text-xs font-medium ${product.stock <= 5 ? "text-red-600" : "text-slate-700"}`}>
                  {product.stock}
                </p>
                <p className="text-xs text-slate-500 truncate">{product.sellerName}</p>
                <p className="text-xs text-slate-400 truncate">{product.category}</p>
                <DeleteButton id={product.id} type="product" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Tabla de vendedores */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-700">Vendedores</h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar por ID de vendedor…"
              value={sellerQuery}
              onChange={(e) => setSellerQuery(e.target.value)}
              className="text-xs border border-slate-200 rounded-md px-3 py-1.5 w-56 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
            <span className="text-xs text-slate-400 border border-slate-200 rounded-md px-2.5 py-1 shrink-0">
              {filteredSellers.length} vendedores
            </span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1.2fr_1.4fr_0.6fr_0.6fr_0.7fr_0.5fr] gap-4 px-5 py-3 bg-slate-50 text-xs font-medium text-slate-500">
            <span>Nombre</span>
            <span>Email</span>
            <span>Productos</span>
            <span>Órdenes</span>
            <span>Alta</span>
            <span className="text-right">Acción</span>
          </div>
          {filteredSellers.length === 0 ? (
            <p className="px-5 py-6 text-xs text-slate-400 text-center">
              Sin resultados para &ldquo;{sellerQuery}&rdquo;
            </p>
          ) : (
            filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="grid grid-cols-[1.2fr_1.4fr_0.6fr_0.6fr_0.7fr_0.5fr] gap-4 px-5 py-3 border-t border-slate-100 items-center"
              >
                <div>
                  <p className="text-xs text-slate-700 font-medium truncate">{seller.name}</p>
                  <p className="font-mono text-xs text-slate-400">{seller.id}</p>
                  {seller.isVerified && (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 rounded px-1.5 py-0.5">
                      Verificado
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{seller.email}</p>
                <p className="text-xs text-slate-700">{seller.productsCount}</p>
                <p className="text-xs text-slate-700">{seller.ordersCount}</p>
                <p className="text-xs text-slate-400">{formatDate(seller.createdAt)}</p>
                <DeleteButton id={seller.id} type="seller" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
