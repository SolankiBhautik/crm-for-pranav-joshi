import { format } from "date-fns";


export const formatDate = (dateValue) => {
    if (!dateValue) return '-';

    // Handle Firebase Timestamp
    if (dateValue && dateValue.toDate) {
        return format(dateValue.toDate(), 'dd/MM/yyyy');
    }

    // Handle regular Date objects or ISO strings
    try {
        return format(new Date(dateValue), 'dd/MM/yyyy');
    } catch (error) {
        console.error('Date formatting error:', error);
        return '-';
    }
};