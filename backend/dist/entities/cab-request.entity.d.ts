import { User } from './user.entity';
import { Property } from './property.entity';
import { Cab } from './cab.entity';
export declare enum CabRequestStatus {
    PENDING = "pending",
    ASSIGNED = "assigned"
}
export declare class CabRequest {
    id: string;
    pickupLocation: string;
    dropLocation: string;
    travelDate: string;
    travelTime: string;
    seatsPreference: string;
    numberOfPeople: number;
    guestName: string;
    guestPhone: string;
    guestEmail: string | null;
    specialRequests: string | null;
    status: CabRequestStatus;
    createdAt: Date;
    user: User | null;
    userId: string | null;
    property: Property;
    propertyId: string;
    host: User;
    hostId: string;
    assignedCab: Cab | null;
    assignedCabId: string | null;
}
