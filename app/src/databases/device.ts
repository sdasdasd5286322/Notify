import type { IDevice } from '../types/database/device';

export async function createDevice(device: Readonly<IDevice>): Promise<void> {
    const deviceExists = await NOTIFY_USERS.get(device.id);
    if (deviceExists) {
        throw new Error('Device already exists');
    }
    await NOTIFY_USERS.put(device.id, JSON.stringify(device));
}

export async function deleteDeviceFromDatabase(deviceId: string): Promise<void> {
    await NOTIFY_USERS.delete(deviceId);
}

export async function getDevice(deviceId: string): Promise<IDevice> {
    const device = await NOTIFY_USERS.get<IDevice>(deviceId, { type: 'json' });
    if (!device) {
        throw new Error('Device not found');
    }
    return device;
}

export async function getAllDevicesIDs(): Promise<string[]> {
    const devices: string[] = [];
    let cursor: string | null = null;
    while (true) {
        const data = await NOTIFY_USERS.list(cursor ? { cursor } : undefined);
        devices.push(...data.keys.map((entry) => entry.name));
        if (data.list_complete) {
            break;
        }
        cursor = data.cursor as string;
    }
    return devices;
}