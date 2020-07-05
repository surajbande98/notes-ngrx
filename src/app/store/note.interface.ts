export interface Note {
    id: number;
    title: string;
    text: string;
    isSelected: boolean;
    isDefault?: boolean;
    createdDate: Date;
}