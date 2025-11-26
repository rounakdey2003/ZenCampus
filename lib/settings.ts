export interface SystemSettings {
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

const DEFAULT_SETTINGS: SystemSettings = {
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
};

let cachedSettings: SystemSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000;

export async function getSystemSettings(): Promise<SystemSettings> {
  const now = Date.now();
  
  if (cachedSettings && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const response = await fetch("/api/settings", {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return DEFAULT_SETTINGS;
    }

    const settings = await response.json();
    
    if (settings.error) {
      return DEFAULT_SETTINGS;
    }

    cachedSettings = settings;
    cacheTimestamp = now;

    return settings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function clearSettingsCache() {
  cachedSettings = null;
  cacheTimestamp = 0;
}

export async function getSetting<K extends keyof SystemSettings>(
  key: K
): Promise<SystemSettings[K]> {
  const settings = await getSystemSettings();
  return settings[key];
}

export function isCanteenOpen(settings: SystemSettings): boolean {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  return currentTime >= settings.canteenOpenTime && currentTime <= settings.canteenCloseTime;
}

export function validateOrderAmount(amount: number, settings: SystemSettings): boolean {
  return amount >= settings.minOrderAmount;
}

export function calculateOrderTotal(subtotal: number, settings: SystemSettings): number {
  return subtotal + settings.deliveryCharges;
}

export function canBookLaundry(currentBookings: number, settings: SystemSettings): boolean {
  return currentBookings < settings.maxBookingsPerStudent;
}

export function getTimeSlots(settings: SystemSettings): string[] {
  const slots: string[] = [];
  const duration = settings.slotDuration;
  
  for (let hour = 7; hour <= 22; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      if (hour === 22 && minute > 0) break;
      
      const startHour = hour;
      const startMin = minute;
      const endMin = minute + duration;
      const endHour = endMin >= 60 ? hour + 1 : hour;
      const adjustedEndMin = endMin >= 60 ? endMin - 60 : endMin;
      
      if (endHour > 22) break;
      
      const start = `${String(startHour).padStart(2, '0')}:${String(startMin).padStart(2, '0')}`;
      const end = `${String(endHour).padStart(2, '0')}:${String(adjustedEndMin).padStart(2, '0')}`;
      
      slots.push(`${start} - ${end}`);
    }
  }
  
  return slots;
}
