"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Loader2, Clock, DollarSign, Settings as SettingsIcon } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { useSettings } from "@/hooks/useSettings";
import { toast } from "sonner";

interface MenuItem {
  _id: string;
  name: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Beverages";
  price: number;
  available: boolean;
  description: string;
}

interface Order {
  _id: string;
  studentName: string;
  studentUSN: string;
  roomNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Delivered";
  createdAt: string;
}

export default function CanteenManagementPage() {
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("menu");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [menuSortBy, setMenuSortBy] = useState<"name" | "price-low" | "price-high" | "category">("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "Breakfast", price: 0, description: "", available: true });

  const { settings } = useSettings();
  const { data: menuItems, loading: menuLoading, error: menuError, refetch: refetchMenu, post: postMenu, put: putMenu, del: delMenu } = useApi<MenuItem[]>("/api/canteen/menu");
  const { data: orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders, put: putOrder } = useApi<Order[]>("/api/canteen/orders");

  useEffect(() => {
    if (activeTab === "menu") {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (filterCategory !== "All") params.category = filterCategory;
      refetchMenu(params);
    } else {
      const params: Record<string, string> = {};
      if (searchQuery) params.search = searchQuery;
      if (filterStatus !== "All") params.status = filterStatus;
      refetchOrders(params);
    }
  }, [activeTab, searchQuery, filterCategory, filterStatus, refetchMenu, refetchOrders]);

  const filteredMenuItems = [...(menuItems || [])]
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
    });
  const filteredOrders = orders || [];

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postMenu(formData);
      toast.success("Menu item added successfully!");
      refetchMenu();
      setShowAddModal(false);
      setFormData({ name: "", category: "Breakfast", price: 0, description: "", available: true });
    } catch (err) {
      toast.error("Failed to add item: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await putMenu(selectedItem._id, formData);
      toast.success("Menu item updated successfully!");
      refetchMenu();
      setShowEditModal(false);
      setSelectedItem(null);
    } catch (err) {
      toast.error("Failed to update item: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await delMenu(id);
      toast.success("Menu item deleted successfully!");
      refetchMenu();
    } catch (err) {
      toast.error("Failed to delete item: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await putOrder(orderId, { status: newStatus });
      toast.success("Order status updated!");
      refetchOrders();
    } catch (err) {
      toast.error("Failed to update order: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const stats = {
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: filteredOrders.length,
    pendingOrders: filteredOrders.filter(o => o.status === "Pending" || o.status === "Preparing").length,
    menuItems: filteredMenuItems.length,
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Canteen Management</h1>
        <p className="text-gray-600 mt-1">Manage menu items and orders</p>
      </div>

      {/* Settings Info Banner */}
      {settings && (
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Operating Hours</p>
                  <p className="text-lg font-bold text-foreground">
                    {settings.canteenOpenTime} - {settings.canteenCloseTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Minimum Order</p>
                  <p className="text-lg font-bold text-foreground">₹{settings.minOrderAmount}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Delivery Charges</p>
                  <p className="text-lg font-bold text-foreground">
                    {settings.deliveryCharges > 0 ? `₹${settings.deliveryCharges}` : 'Free'}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/admin/settings'}
                className="w-full md:w-auto"
              >
                <SettingsIcon className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Menu Items</p>
            <p className="text-2xl font-bold text-foreground">{stats.menuItems}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "menu" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
        >
          Menu Items
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === "orders" ? "border-b-2 border-primary text-primary" : "text-gray-600"}`}
        >
          Orders
        </button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={activeTab === "menu" ? "Search menu items..." : "Search orders..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "menu" ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                >
                  <option value="All">All Categories</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                </select>
                <select
                  value={menuSortBy}
                  onChange={(e) => setMenuSortBy(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="category">Sort by Category</option>
                </select>
                <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            ) : (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg w-full sm:w-auto"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
              </select>
            )}
          </div>
        </CardContent>
      </Card>

      {activeTab === "menu" ? (
        <Card>
          <CardHeader>
            <CardTitle>Menu Items ({filteredMenuItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {menuLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">Loading menu...</span>
              </div>
            ) : menuError ? (
              <div className="text-center py-8 text-destructive">Error: {menuError}</div>
            ) : filteredMenuItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No menu items found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMenuItems.map((item) => (
                  <div key={item._id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge variant={item.available ? "success" : "secondary"} className="text-xs ml-2">
                        {item.available ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <Badge variant="outline" className="text-xs">{item.category}</Badge>
                        <p className="text-lg font-bold text-green-600 mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedItem(item);
                            setFormData({ name: item.name, category: item.category, price: item.price, description: item.description, available: item.available });
                            setShowEditModal(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item._id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-2">Loading orders...</span>
              </div>
            ) : ordersError ? (
              <div className="text-center py-8 text-destructive">Error: {ordersError}</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No orders found.</div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="p-4 border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-2 gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{order.studentName} ({order.studentUSN})</h4>
                        <p className="text-sm text-muted-foreground">Room: {order.roomNumber}</p>
                        <div className="mt-2">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {item.name} x{item.quantity} - ₹{item.price}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-lg font-bold text-green-600">₹{order.total}</p>
                        <Badge variant={
                          order.status === "Delivered" ? "success" :
                          order.status === "Ready" ? "default" :
                          order.status === "Preparing" ? "warning" : "secondary"
                        } className="mt-2">
                          {order.status}
                        </Badge>
                        {order.status !== "Delivered" && (
                          <div className="mt-2 flex flex-col gap-1">
                            {order.status === "Pending" && (
                              <Button size="sm" onClick={() => handleUpdateOrderStatus(order._id, "Preparing")}>
                                Start Preparing
                              </Button>
                            )}
                            {order.status === "Preparing" && (
                              <Button size="sm" onClick={() => handleUpdateOrderStatus(order._id, "Ready")}>
                                Mark Ready
                              </Button>
                            )}
                            {order.status === "Ready" && (
                              <Button size="sm" onClick={() => handleUpdateOrderStatus(order._id, "Delivered")}>
                                Mark Delivered
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Beverages"})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} />
                <label className="text-sm">Available</label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit">Add Item</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
            <form onSubmit={handleEditItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value as "Breakfast" | "Lunch" | "Dinner" | "Snacks" | "Beverages"})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Beverages">Beverages</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price (₹)</label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({...formData, available: e.target.checked})} />
                <label className="text-sm">Available</label>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button type="submit">Update Item</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
