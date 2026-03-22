const SHOPIER_API = "https://api.shopier.com/v1";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.SHOPIER_API_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

interface ShopierProduct {
  id: string;
  title: string;
  url: string;
  priceData: {
    price: string;
    currency: string;
  };
}

export async function createShopierProduct(params: {
  title: string;
  description: string;
  price: number; // kuruş cinsinden
  imageUrl?: string;
}): Promise<ShopierProduct> {
  const priceInTL = params.price / 100;

  const body: Record<string, unknown> = {
    title: params.title,
    description: params.description || params.title,
    type: "digital",
    shippingPayer: "sellerPays",
    priceData: {
      price: priceInTL,
      currency: "TRY",
    },
    media: [
      {
        url: params.imageUrl || "https://placehold.co/400x400.png",
        type: "image",
        placement: 1,
      },
    ],
  };

  const res = await fetch(`${SHOPIER_API}/products`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Shopier ürün oluşturma hatası: ${error}`);
  }

  return res.json();
}

export async function updateShopierProduct(
  shopierProductId: string,
  params: {
    title?: string;
    description?: string;
    price?: number; // kuruş cinsinden
  }
): Promise<ShopierProduct> {
  const body: Record<string, unknown> = {};

  if (params.title) body.title = params.title;
  if (params.description) body.description = params.description;
  if (params.price !== undefined) {
    body.priceData = {
      price: params.price / 100,
      currency: "TRY",
    };
  }

  const res = await fetch(`${SHOPIER_API}/products/${shopierProductId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Shopier ürün güncelleme hatası: ${error}`);
  }

  return res.json();
}

export async function deleteShopierProduct(shopierProductId: string): Promise<void> {
  const res = await fetch(`${SHOPIER_API}/products/${shopierProductId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Shopier ürün silme hatası: ${error}`);
  }
}
