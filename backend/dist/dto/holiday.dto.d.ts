export declare class CreateHolidayDto {
    title: string;
    destination: string;
    description: string;
    price: number;
    duration: number;
    images?: string[];
    inclusions?: string[];
    exclusions?: string[];
    startDate: string;
    endDate: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
export declare class UpdateHolidayDto {
    title?: string;
    destination?: string;
    description?: string;
    price?: number;
    duration?: number;
    images?: string[];
    inclusions?: string[];
    exclusions?: string[];
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
