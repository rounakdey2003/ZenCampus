"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  Settings,
  Save,
  Shield,
  Database,
  Loader2,
  Info,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
interface SystemSettings {
  _id?: string;
  hostelName: string;
  adminEmail: string;
  adminPhone: string;
  address: string;
  maxComplaintsPerDay: number;
  autoArchiveNotices: number;
  maintenanceResponseTime: number;
  washingMachines: number;
  dryers: number;
  slotDuration: number;
  maxBookingsPerStudent: number;
  laundryNotice: string;
  canteenOpenTime: string;
  canteenCloseTime: string;
  minOrderAmount: number;
  deliveryCharges: number;
  passwordExpiry: number;
  maxLoginAttempts: number;
  sessionTimeout: number;
  twoFactorAuth: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    hostelName: "ZenCampus Hostel",
    adminEmail: "admin@zencampus.edu",
    adminPhone: "+91 98765 43210",
    address: "Campus Road, University Area",
    maxComplaintsPerDay: 3,
    autoArchiveNotices: 30,
    maintenanceResponseTime: 24,
    washingMachines: 5,
    dryers: 3,
    slotDuration: 60,
    maxBookingsPerStudent: 2,
    laundryNotice: "",
    canteenOpenTime: "07:00",
    canteenCloseTime: "22:00",
    minOrderAmount: 20,
    deliveryCharges: 0,
    passwordExpiry: 90,
    maxLoginAttempts: 3,
    sessionTimeout: 30,
    twoFactorAuth: false,
  });

  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSettings(data);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const settingsResponse = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!settingsResponse.ok) {
        throw new Error(`HTTP error! status: ${settingsResponse.status}`);
      }

      const settingsData = await settingsResponse.json();
      if (settingsData.error) {
        throw new Error(settingsData.error);
      }

      const machinesResponse = await fetch("/api/machines", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          washingCount: settings.washingMachines,
          dryerCount: settings.dryers,
        }),
      });

      if (!machinesResponse.ok) {
        console.warn("Failed to sync machine counts");
      }

      setSettings(settingsData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50';
      successDiv.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Settings saved and synchronized successfully!</span>
      `;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
    } catch (err) {
      toast.error("Failed to save settings: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const handleChange = (key: string, value: string | number | boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-8">
        <div className="text-center py-8 text-red-600">
          <p className="font-semibold mb-2">Error loading settings</p>
          <p className="text-sm">{fetchError}</p>
          <Button onClick={fetchSettings} className="mt-4">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure hostel management system preferences</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Settings Integration</p>
              <p>These settings are automatically applied across the entire system. Changes to laundry and canteen settings will immediately affect booking availability and order requirements.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hostel Name</label>
              <Input
                value={settings.hostelName}
                onChange={(e) => handleChange("hostelName", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Email</label>
              <Input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleChange("adminEmail", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Admin Phone</label>
              <Input
                value={settings.adminPhone}
                onChange={(e) => handleChange("adminPhone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hostel Address</label>
              <Input
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Max Complaints Per Day</label>
              <Input
                type="number"
                value={settings.maxComplaintsPerDay}
                onChange={(e) => handleChange("maxComplaintsPerDay", parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Auto Archive Notices (days)</label>
              <Input
                type="number"
                value={settings.autoArchiveNotices}
                onChange={(e) => handleChange("autoArchiveNotices", parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maintenance Response Time (hrs)</label>
              <Input
                type="number"
                value={settings.maintenanceResponseTime}
                onChange={(e) => handleChange("maintenanceResponseTime", parseInt(e.target.value))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laundry Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            These settings control the laundry booking system and machine availability.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Washing Machines</label>
              <Input
                type="number"
                value={settings.washingMachines}
                onChange={(e) => handleChange("washingMachines", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Total number of washing machines available</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dryers</label>
              <Input
                type="number"
                value={settings.dryers}
                onChange={(e) => handleChange("dryers", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Total number of dryers available</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slot Duration (minutes)</label>
              <Input
                type="number"
                value={settings.slotDuration}
                onChange={(e) => handleChange("slotDuration", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Duration of each booking slot</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Bookings Per Student</label>
              <Input
                type="number"
                value={settings.maxBookingsPerStudent}
                onChange={(e) => handleChange("maxBookingsPerStudent", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Maximum concurrent bookings allowed per student</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Laundry Notice Message</label>
              <textarea
                value={settings.laundryNotice}
                onChange={(e) => handleChange("laundryNotice", e.target.value)}
                placeholder="Enter notice message for students (e.g., Maintenance scheduled, booking guidelines, etc.)"
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1">This message will be displayed to students on the laundry booking page</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Canteen Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            These settings control canteen operating hours and order requirements.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Opening Time</label>
              <Input
                type="time"
                value={settings.canteenOpenTime}
                onChange={(e) => handleChange("canteenOpenTime", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Daily opening time</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Closing Time</label>
              <Input
                type="time"
                value={settings.canteenCloseTime}
                onChange={(e) => handleChange("canteenCloseTime", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Daily closing time</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Order Amount (₹)</label>
              <Input
                type="number"
                value={settings.minOrderAmount}
                onChange={(e) => handleChange("minOrderAmount", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Minimum order value required</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Delivery Charges (₹)</label>
              <Input
                type="number"
                value={settings.deliveryCharges}
                onChange={(e) => handleChange("deliveryCharges", parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-500 mt-1">Additional delivery charges (0 for free delivery)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Password Expiry (days)</label>
              <Input
                type="number"
                value={settings.passwordExpiry}
                onChange={(e) => handleChange("passwordExpiry", parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
              <Input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleChange("maxLoginAttempts", parseInt(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Require 2FA for admin login</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleChange("twoFactorAuth", e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
