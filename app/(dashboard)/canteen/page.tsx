"use client";

import { useState, useEffect, Suspense, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui";
import { Coffee, Plus, Minus, ShoppingCart, Loader2, Receipt, Clock } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  _id: string;
  studentUSN: string;
  studentName: string;
  roomNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
}

type MenuSortOption = "name" | "price-low" | "price-high" | "category";



function CanteenContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "menu";
  const { user } = useUser();
  
  const studentUSN = user?.usn || "";
  const studentName = user?.name || "";
  const roomNumber = user?.roomNumber || "";
  const [cart, setCart] = useState<CartItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [orderLoading, setOrderLoading] = useState(false);
  const [menuSortBy, setMenuSortBy] = useState<MenuSortOption>("name");
  const [sortBy, setSortBy] = useState<"date" | "status">("date");

  const { data: menuItems, loading, error, refetch } = useApi<MenuItem[]>("/api/canteen/menu");
  const { post: postOrder } = useApi("/api/canteen/orders");
  const { data: orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useApi<Order[]>("/api/canteen/orders", { 
    autoFetch: false 
  });

  useEffect(() => {
    if (studentUSN) {
      refetchOrders({ usn: studentUSN });
    }
  }, [studentUSN, refetchOrders]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filterCategory !== "All") params.category = filterCategory;
    params.available = "true";
    refetch(params);
  }, [filterCategory, refetch]);

  const addToCart = (item: MenuItem) => {
    if (!item.available) {
      toast.error("This item is currently unavailable");
      return;
    }
    const existing = cart.find(c => c._id === item._id);
    if (existing) {
      setCart(cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.find(c => c._id === itemId);
    if (existing && existing.quantity > 1) {
      setCart(cart.map(c => c._id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
    } else {
      setCart(cart.filter(c => c._id !== itemId));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cart is empty!");
      return;
    }

    try {
      setOrderLoading(true);
      await postOrder({
        studentUSN,
        studentName,
        roomNumber,
        items: cart.map(c => ({
          name: c.name,
          quantity: c.quantity,
          price: c.price,
        })),
        total: totalAmount,
        status: "Pending",
      });
      toast.success("Order placed successfully!");
      setCart([]);
      refetchOrders({ usn: studentUSN });
    } catch (err) {
      toast.error("Failed to place order: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div>
      <DashboardHeader title="Canteen" />
      
      <div className="p-4 md:p-8 space-y-6">        
        <div className="flex gap-2 md:gap-4 border-b pb-2 overflow-x-auto">
          <Link href="/canteen?tab=menu" className={`px-3 md:px-4 py-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === "menu" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Coffee className="w-4 h-4 inline mr-2" />
            Order Menu
          </Link>
          <Link href="/canteen?tab=orders" className={`px-3 md:px-4 py-2 font-medium cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === "orders" 
              ? "text-primary border-b-2 border-primary" 
              : "text-gray-600 hover:text-gray-900"
          }`}>
            <Receipt className="w-4 h-4 inline mr-2" />
            Orders
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{(orders || []).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-2xl font-bold text-amber-600">
                {(orders || []).filter(o => o.status === "Pending" || o.status === "Preparing").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{(orders || []).reduce((sum, o) => sum + o.total, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Available Items</p>
              <p className="text-2xl font-bold text-blue-600">
                {(menuItems || []).filter(m => m.available).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        {activeTab === "menu" && (
          <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex gap-2 flex-wrap">
                {["All", "Breakfast", "Lunch", "Dinner", "Snacks", "Beverages"].map((cat) => (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={menuSortBy}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setMenuSortBy(e.target.value as MenuSortOption)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="category">Sort by Category</option>
                </select>
                <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-bold">{cart.length} items • ₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coffee className="w-6 h-6 text-primary" />
                      Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    ) : error ? (
                      <div className="text-center py-8 text-red-600">Error: {error}</div>
                    ) : (menuItems || []).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No items available</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...(menuItems || [])]
                          .filter(item => item.available)
                          .filter(item => filterCategory === "All" || item.category === filterCategory)
                          .sort((a, b) => {
                            switch (menuSortBy) {
                              case "name":
                                return a.name.localeCompare(b.name);
                              case "price-low":
                                return a.price - b.price;
                              case "price-high":
                                return b.price - a.price;
                              case "category":
                                return a.category.localeCompare(b.category);
                              default:
                                return 0;
                            }
                          })
                          .map((item) => (
                          <div key={item._id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-gray-600">{item.description}</p>
                              </div>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="text-lg font-bold">₹{item.price}</span>
                              <Button size="sm" onClick={() => addToCart(item)} disabled={!item.available}>
                                <Plus className="w-4 h-4 mr-1" /> Add
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Cart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">Cart is empty</div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item._id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => removeFromCart(item._id)}>
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="font-bold">{item.quantity}</span>
                              <Button size="sm" variant="outline" onClick={() => addToCart(item)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="pt-3 border-t">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-bold">Total:</span>
                            <span className="text-xl font-bold">₹{totalAmount}</span>
                          </div>
                          <Button className="w-full" onClick={handlePlaceOrder} disabled={orderLoading}>
                            {orderLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Placing Order...
                              </>
                            ) : (
                              "Place Order"
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
        
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Order History</h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "status")}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : ordersError ? (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center text-red-600">Error: {ordersError}</div>
                </CardContent>
              </Card>
            ) : !orders || orders.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">No orders yet</p>
                    <p className="text-sm mt-2">Your order history will appear here</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              [...(orders || [])].sort((a, b) => {
                if (sortBy === "date") {
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                } else {
                  const statusOrder = { "Pending": 0, "Preparing": 1, "Ready": 2, "Delivered": 3, "Cancelled": 4 };
                  return (statusOrder[a.status as keyof typeof statusOrder] || 0) - (statusOrder[b.status as keyof typeof statusOrder] || 0);
                }
              }).map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Receipt className="w-5 h-5 text-primary" />
                          Order #{order._id.slice(-6).toUpperCase()}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </div>
                      </div>
                      <Badge 
                        variant={
                          order.status === "Delivered" ? "default" :
                          order.status === "Ready" ? "secondary" :
                          order.status === "Preparing" ? "outline" :
                          "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-sm text-gray-600">× {item.quantity}</span>
                              </div>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">₹{order.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function CanteenPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="animate-spin w-8 h-8" /></div>}>
      <CanteenContent />
    </Suspense>
  );
}
