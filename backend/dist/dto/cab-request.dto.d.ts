export declare class CreateCabRequestDto {
    pickupLocation: string;
    dropLocation: string;
    travelDate: string;
    travelTime: string;
    seatsPreference?: string;
    numberOfPeople: number;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    specialRequests?: string;
    propertyId: string;
}
export declare class AssignCabRequestDto {
    cabId: string;
}
